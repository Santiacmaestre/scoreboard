import { NextRequest, NextResponse } from "next/server";
import {
  createContribution,
  listContributions,
  getUserProfile,
  getContributionTypes,
} from "@/lib/dynamodb";
import { requireAuth } from "@/lib/auth-helpers";
import { CreateContributionInput } from "@/lib/types";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const data = await listContributions();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error listing contributions:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const body: CreateContributionInput = await request.json();

    if (!body.typeSlug || !body.title || body.points == null) {
      return NextResponse.json(
        { error: "Missing required fields: typeSlug, title, points" },
        { status: 400 }
      );
    }

    if (!body.personId && !body.newPerson?.name) {
      return NextResponse.json(
        { error: "Either personId or newPerson.name is required" },
        { status: 400 }
      );
    }

    if (body.points <= 0) {
      return NextResponse.json(
        { error: "Points must be a positive number" },
        { status: 400 }
      );
    }

    // Validate type compatibility with person's section
    let personSection = body.newPerson?.section;
    if (body.personId) {
      const profile = await getUserProfile(body.personId);
      if (!profile) {
        return NextResponse.json(
          { error: "Person not found" },
          { status: 404 }
        );
      }
      personSection = profile.section;
    }

    if (personSection) {
      const types = await getContributionTypes(true);
      const contribType = types.find((t) => t.slug === body.typeSlug);
      if (!contribType) {
        return NextResponse.json(
          { error: `Unknown contribution type: ${body.typeSlug}` },
          { status: 400 }
        );
      }
      if (
        contribType.appliesTo !== "both" &&
        contribType.appliesTo !== personSection
      ) {
        return NextResponse.json(
          {
            error: `Type "${contribType.name}" does not apply to ${personSection}`,
          },
          { status: 400 }
        );
      }
    }

    const contribution = await createContribution(
      body,
      session?.user?.email || undefined
    );

    return NextResponse.json({ data: contribution }, { status: 201 });
  } catch (err) {
    console.error("Error creating contribution:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
