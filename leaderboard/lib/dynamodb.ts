import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  UserProfile,
  Contribution,
  ContributionTypeConfig,
  Section,
  CreateContributionInput,
} from "./types";
import { getInitials, getRandomAvatarColor } from "./utils";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE = process.env.DYNAMODB_TABLE_NAME || "Leaderboard";

function gsiPK(section: Section): string {
  return section === "leaders" ? "LEADER" : "CONTRIBUTOR";
}

// --------------- Leaderboard (public) ---------------

export async function getLeaderboard(
  type: "leaders" | "contributors"
): Promise<UserProfile[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: { ":pk": gsiPK(type) },
      ScanIndexForward: false,
    })
  );

  return (result.Items || []).map((item, index) => ({
    userId: item.userId,
    name: item.name,
    initials: item.initials,
    email: item.email,
    avatarColor: item.avatarColor,
    section: item.section,
    totalPoints: item.totalPoints || 0,
    totalContributions: item.totalContributions || 0,
    rank: index + 1,
    createdAt: item.createdAt,
  }));
}

// --------------- Users ---------------

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: "PROFILE" },
    })
  );
  if (!result.Item) return null;
  const item = result.Item;
  return {
    userId: item.userId,
    name: item.name,
    initials: item.initials,
    email: item.email,
    avatarColor: item.avatarColor,
    section: item.section,
    totalPoints: item.totalPoints || 0,
    totalContributions: item.totalContributions || 0,
    rank: item.rank || 0,
    createdAt: item.createdAt,
  };
}

export async function getUserContributions(
  userId: string
): Promise<Contribution[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":sk": "CONTRIB#",
      },
      ScanIndexForward: false,
    })
  );

  return (result.Items || []).map((item) => ({
    id: item.contribId,
    userId: item.userId,
    typeSlug: item.typeSlug,
    title: item.title,
    description: item.description,
    points: item.points,
    date: item.date,
    createdAt: item.createdAt,
    createdBy: item.createdBy,
  }));
}

export async function searchPersons(query: string): Promise<UserProfile[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TABLE,
      FilterExpression:
        "begins_with(PK, :userPrefix) AND SK = :profile AND contains(#n, :query)",
      ExpressionAttributeNames: { "#n": "name" },
      ExpressionAttributeValues: {
        ":userPrefix": "USER#",
        ":profile": "PROFILE",
        ":query": query,
      },
    })
  );

  return (result.Items || []).map((item) => ({
    userId: item.userId,
    name: item.name,
    initials: item.initials,
    email: item.email,
    avatarColor: item.avatarColor,
    section: item.section,
    totalPoints: item.totalPoints || 0,
    totalContributions: item.totalContributions || 0,
    rank: 0,
    createdAt: item.createdAt,
  }));
}

async function createPerson(data: {
  name: string;
  email?: string;
  section: Section;
}): Promise<string> {
  const userId = crypto.randomUUID().slice(0, 8);
  const now = new Date().toISOString();

  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `USER#${userId}`,
        SK: "PROFILE",
        userId,
        name: data.name,
        initials: getInitials(data.name),
        email: data.email || null,
        avatarColor: getRandomAvatarColor(),
        section: data.section,
        totalPoints: 0,
        totalContributions: 0,
        createdAt: now,
      },
    })
  );

  return userId;
}

export async function changePersonSection(
  userId: string,
  newSection: Section
): Promise<void> {
  const profile = await getUserProfile(userId);
  if (!profile) throw new Error("User not found");
  if (profile.section === newSection) return;

  const oldGsiPK = gsiPK(profile.section);
  const newGsiPK = gsiPK(newSection);

  // Delete old leaderboard entry
  const oldSK = `${oldGsiPK}#${String(profile.totalPoints).padStart(8, "0")}#${userId}`;
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { PK: "LEADERBOARD", SK: oldSK },
    })
  );

  // Update profile section
  await docClient.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: "PROFILE" },
      UpdateExpression: "SET #sec = :sec",
      ExpressionAttributeNames: { "#sec": "section" },
      ExpressionAttributeValues: { ":sec": newSection },
    })
  );

  // Create new leaderboard entry
  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: "LEADERBOARD",
        SK: `${newGsiPK}#${String(profile.totalPoints).padStart(8, "0")}#${userId}`,
        GSI1PK: newGsiPK,
        GSI1SK: profile.totalPoints,
        userId,
        name: profile.name,
        initials: profile.initials,
        email: profile.email,
        avatarColor: profile.avatarColor,
        section: newSection,
        totalPoints: profile.totalPoints,
        totalContributions: profile.totalContributions,
        createdAt: profile.createdAt,
      },
    })
  );
}

// --------------- Contributions ---------------

export async function createContribution(
  input: CreateContributionInput,
  adminEmail?: string
): Promise<Contribution> {
  let userId = input.personId;

  if (!userId && input.newPerson) {
    userId = await createPerson(input.newPerson);
  }

  if (!userId) throw new Error("personId or newPerson is required");

  const profile = await getUserProfile(userId);
  if (!profile) throw new Error("User not found");

  const now = new Date().toISOString();
  const contribId = crypto.randomUUID();
  const userGsiPK = gsiPK(profile.section);

  // Write contribution
  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `USER#${userId}`,
        SK: `CONTRIB#${now}#${contribId}`,
        contribId,
        userId,
        typeSlug: input.typeSlug,
        title: input.title,
        description: input.description || null,
        points: input.points,
        date: input.date,
        createdAt: now,
        createdBy: adminEmail || null,
      },
    })
  );

  // Delete old leaderboard entry (score changed, SK includes score)
  const oldSK = `${userGsiPK}#${String(profile.totalPoints).padStart(8, "0")}#${userId}`;
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { PK: "LEADERBOARD", SK: oldSK },
    })
  );

  // Update user profile totals
  await docClient.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: "PROFILE" },
      UpdateExpression:
        "SET totalPoints = totalPoints + :pts, totalContributions = totalContributions + :one",
      ExpressionAttributeValues: {
        ":pts": input.points,
        ":one": 1,
      },
    })
  );

  const newTotal = profile.totalPoints + input.points;
  const newContribs = profile.totalContributions + 1;

  // Create new leaderboard entry with updated score
  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: "LEADERBOARD",
        SK: `${userGsiPK}#${String(newTotal).padStart(8, "0")}#${userId}`,
        GSI1PK: userGsiPK,
        GSI1SK: newTotal,
        userId,
        name: profile.name,
        initials: profile.initials,
        email: profile.email,
        avatarColor: profile.avatarColor,
        section: profile.section,
        totalPoints: newTotal,
        totalContributions: newContribs,
        createdAt: profile.createdAt,
      },
    })
  );

  return {
    id: contribId,
    userId,
    typeSlug: input.typeSlug,
    title: input.title,
    description: input.description,
    points: input.points,
    date: input.date,
    createdAt: now,
    createdBy: adminEmail,
  };
}

export async function listContributions(): Promise<Contribution[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TABLE,
      FilterExpression:
        "begins_with(PK, :userPrefix) AND begins_with(SK, :contribPrefix)",
      ExpressionAttributeValues: {
        ":userPrefix": "USER#",
        ":contribPrefix": "CONTRIB#",
      },
    })
  );

  return (result.Items || [])
    .map((item) => ({
      id: item.contribId,
      userId: item.userId,
      typeSlug: item.typeSlug,
      title: item.title,
      description: item.description,
      points: item.points,
      date: item.date,
      createdAt: item.createdAt,
      createdBy: item.createdBy,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function deleteContribution(
  userId: string,
  contribId: string
): Promise<void> {
  // Find the contribution
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      FilterExpression: "contribId = :cid",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":sk": "CONTRIB#",
        ":cid": contribId,
      },
    })
  );

  if (!result.Items || result.Items.length === 0) return;
  const item = result.Items[0];
  const points = item.points as number;

  const profile = await getUserProfile(userId);
  if (!profile) return;

  const userGsiPK = gsiPK(profile.section);

  // Delete contribution
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: item.SK },
    })
  );

  // Delete old leaderboard entry
  const oldSK = `${userGsiPK}#${String(profile.totalPoints).padStart(8, "0")}#${userId}`;
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { PK: "LEADERBOARD", SK: oldSK },
    })
  );

  // Update user totals
  await docClient.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: "PROFILE" },
      UpdateExpression:
        "SET totalPoints = totalPoints - :pts, totalContributions = totalContributions - :one",
      ExpressionAttributeValues: {
        ":pts": points,
        ":one": 1,
      },
    })
  );

  const newTotal = profile.totalPoints - points;
  const newContribs = profile.totalContributions - 1;

  // Create new leaderboard entry
  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: "LEADERBOARD",
        SK: `${userGsiPK}#${String(newTotal).padStart(8, "0")}#${userId}`,
        GSI1PK: userGsiPK,
        GSI1SK: newTotal,
        userId,
        name: profile.name,
        initials: profile.initials,
        email: profile.email,
        avatarColor: profile.avatarColor,
        section: profile.section,
        totalPoints: newTotal,
        totalContributions: newContribs,
        createdAt: profile.createdAt,
      },
    })
  );
}

// --------------- Contribution Types ---------------

export async function getContributionTypes(
  onlyActive = true
): Promise<ContributionTypeConfig[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": "CONFIG",
        ":sk": "CONTRIB_TYPE#",
      },
    })
  );

  let items = (result.Items || []).map((item) => ({
    slug: item.slug,
    name: item.name,
    appliesTo: item.appliesTo,
    colorDot: item.colorDot,
    colorBadgeBg: item.colorBadgeBg,
    colorBadgeText: item.colorBadgeText,
    active: item.active !== false,
    createdAt: item.createdAt,
  }));

  if (onlyActive) {
    items = items.filter((t) => t.active);
  }

  return items;
}

export async function createContributionType(
  data: Omit<ContributionTypeConfig, "active" | "createdAt">
): Promise<ContributionTypeConfig> {
  const now = new Date().toISOString();
  const item: ContributionTypeConfig = {
    ...data,
    active: true,
    createdAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: "CONFIG",
        SK: `CONTRIB_TYPE#${data.slug}`,
        ...item,
      },
    })
  );

  return item;
}

export async function updateContributionType(
  slug: string,
  data: Partial<ContributionTypeConfig>
): Promise<void> {
  const expressions: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (key === "slug") return;
    const attrName = `#${key}`;
    const attrValue = `:${key}`;
    names[attrName] = key;
    values[attrValue] = value;
    expressions.push(`${attrName} = ${attrValue}`);
  });

  if (expressions.length === 0) return;

  await docClient.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: "CONFIG", SK: `CONTRIB_TYPE#${slug}` },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
}

export async function deactivateContributionType(
  slug: string
): Promise<void> {
  await updateContributionType(slug, { active: false });
}
