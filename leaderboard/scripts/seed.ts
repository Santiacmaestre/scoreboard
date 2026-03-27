import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE = process.env.DYNAMODB_TABLE_NAME || "Leaderboard";

const AVATAR_COLORS = [
  "#854F0B", "#115E59", "#5B21B6", "#9A3412",
  "#1E40AF", "#BE185D", "#047857", "#7C3AED",
  "#B91C1C", "#0369A1", "#4338CA", "#A16207",
];

async function put(item: Record<string, unknown>) {
  await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
}

// ─── Contribution Types ───

const CONTRIBUTION_TYPES = [
  { slug: "lightning-talk", name: "Charla Lightning", appliesTo: "both", colorDot: "#EF9F27", colorBadgeBg: "#FAEEDA", colorBadgeText: "#854F0B" },
  { slug: "foundational-talk", name: "Charla Foundational", appliesTo: "both", colorDot: "#378ADD", colorBadgeBg: "#E6F1FB", colorBadgeText: "#185FA5" },
  { slug: "advanced-talk", name: "Charla Advanced", appliesTo: "both", colorDot: "#7F77DD", colorBadgeBg: "#EEEDFE", colorBadgeText: "#534AB7" },
  { slug: "workshop", name: "Workshop", appliesTo: "both", colorDot: "#D85A30", colorBadgeBg: "#FAECE7", colorBadgeText: "#993C1D" },
  { slug: "event-lead", name: "Full Event Lead", appliesTo: "both", colorDot: "#1D9E75", colorBadgeBg: "#E1F5EE", colorBadgeText: "#0F6E56" },
  { slug: "mentor", name: "Mentor", appliesTo: "both", colorDot: "#D4537E", colorBadgeBg: "#FBEAF0", colorBadgeText: "#993556" },
  { slug: "bring-sponsor", name: "Bring Sponsor", appliesTo: "both", colorDot: "#854F0B", colorBadgeBg: "#FAEEDA", colorBadgeText: "#633806" },
  { slug: "voluntario", name: "Voluntario", appliesTo: "both", colorDot: "#639922", colorBadgeBg: "#EAF3DE", colorBadgeText: "#3B6D11" },
];

// ─── Users ───

interface SeedUser {
  userId: string;
  name: string;
  initials: string;
  avatarColorIndex: number;
  section: "contributors" | "leaders";
  totalPoints: number;
  totalContributions: number;
  contributions: {
    typeSlug: string;
    title: string;
    points: number;
    date: string;
    createdAt: string;
  }[];
}

const users: SeedUser[] = [
  {
    userId: "001", name: "María Camila R.", initials: "MC", avatarColorIndex: 0,
    section: "contributors", totalPoints: 232, totalContributions: 5,
    contributions: [
      { typeSlug: "lightning-talk", title: "Intro a AWS Lambda", points: 45, date: "2025-03-15", createdAt: "2025-03-15T10:30:00Z" },
      { typeSlug: "foundational-talk", title: "Documentación API v3.2", points: 30, date: "2025-03-14", createdAt: "2025-03-14T14:20:00Z" },
      { typeSlug: "workshop", title: "Workshop de Terraform", points: 52, date: "2025-03-13", createdAt: "2025-03-13T09:15:00Z" },
      { typeSlug: "event-lead", title: "Lead meetup marzo", points: 80, date: "2025-03-10", createdAt: "2025-03-10T16:45:00Z" },
      { typeSlug: "mentor", title: "Mentoría onboarding equipo", points: 25, date: "2025-03-08", createdAt: "2025-03-08T11:00:00Z" },
    ],
  },
  {
    userId: "002", name: "Andrés Salazar", initials: "AS", avatarColorIndex: 1,
    section: "contributors", totalPoints: 190, totalContributions: 3,
    contributions: [
      { typeSlug: "advanced-talk", title: "Deep dive en DynamoDB", points: 90, date: "2025-03-14", createdAt: "2025-03-14T08:00:00Z" },
      { typeSlug: "workshop", title: "Workshop CI/CD", points: 65, date: "2025-03-12", createdAt: "2025-03-12T13:30:00Z" },
      { typeSlug: "foundational-talk", title: "Guía de onboarding v2", points: 35, date: "2025-03-10", createdAt: "2025-03-10T10:00:00Z" },
    ],
  },
  {
    userId: "003", name: "Laura Pineda", initials: "LP", avatarColorIndex: 2,
    section: "contributors", totalPoints: 245, totalContributions: 3,
    contributions: [
      { typeSlug: "event-lead", title: "Lead hackathon Q1", points: 120, date: "2025-03-15", createdAt: "2025-03-15T09:00:00Z" },
      { typeSlug: "lightning-talk", title: "Lightning talk microservicios", points: 55, date: "2025-03-13", createdAt: "2025-03-13T15:00:00Z" },
      { typeSlug: "mentor", title: "Mentoría equipo backend", points: 70, date: "2025-03-11", createdAt: "2025-03-11T11:30:00Z" },
    ],
  },
  {
    userId: "101", name: "Camilo Ríos", initials: "CR", avatarColorIndex: 3,
    section: "leaders", totalPoints: 350, totalContributions: 2,
    contributions: [
      { typeSlug: "event-lead", title: "Lead conferencia anual", points: 200, date: "2025-03-10", createdAt: "2025-03-10T09:00:00Z" },
      { typeSlug: "mentor", title: "Programa mentoría Q1", points: 150, date: "2025-03-05", createdAt: "2025-03-05T14:00:00Z" },
    ],
  },
];

async function seed() {
  console.log(`Seeding table: ${TABLE}\n`);

  // Seed contribution types
  console.log("--- Contribution Types ---");
  for (const t of CONTRIBUTION_TYPES) {
    await put({
      PK: "CONFIG",
      SK: `CONTRIB_TYPE#${t.slug}`,
      ...t,
      active: true,
      createdAt: "2025-03-01T00:00:00Z",
    });
    console.log(`  ✓ ${t.name}`);
  }

  // Seed users
  console.log("\n--- Users ---");
  for (const user of users) {
    const avatarColor = AVATAR_COLORS[user.avatarColorIndex];
    const now = "2025-03-01T00:00:00Z";
    const gsi1pk = user.section === "leaders" ? "LEADER" : "CONTRIBUTOR";

    // Profile
    await put({
      PK: `USER#${user.userId}`,
      SK: "PROFILE",
      userId: user.userId,
      name: user.name,
      initials: user.initials,
      avatarColor,
      section: user.section,
      totalPoints: user.totalPoints,
      totalContributions: user.totalContributions,
      createdAt: now,
    });
    console.log(`  ✓ Profile: ${user.name} (${user.section})`);

    // Single leaderboard entry
    await put({
      PK: "LEADERBOARD",
      SK: `${gsi1pk}#${String(user.totalPoints).padStart(8, "0")}#${user.userId}`,
      GSI1PK: gsi1pk,
      GSI1SK: user.totalPoints,
      userId: user.userId,
      name: user.name,
      initials: user.initials,
      avatarColor,
      section: user.section,
      totalPoints: user.totalPoints,
      totalContributions: user.totalContributions,
      createdAt: now,
    });
    console.log(`  ✓ Leaderboard entry (${gsi1pk})`);

    // Contributions
    for (const c of user.contributions) {
      const contribId = crypto.randomUUID();
      await put({
        PK: `USER#${user.userId}`,
        SK: `CONTRIB#${c.createdAt}#${contribId}`,
        contribId,
        userId: user.userId,
        typeSlug: c.typeSlug,
        title: c.title,
        points: c.points,
        date: c.date,
        createdAt: c.createdAt,
      });
    }
    console.log(`  ✓ ${user.contributions.length} contributions`);
  }

  console.log("\nSeed complete!");
}

seed().catch(console.error);
