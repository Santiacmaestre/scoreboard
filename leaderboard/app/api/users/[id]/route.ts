import { NextRequest, NextResponse } from "next/server";
import {
  getUserProfile,
  getUserContributions,
  changePersonSection,
  deletePerson,
} from "@/lib/dynamodb";
import { requireAuth } from "@/lib/auth-helpers";
import { Section } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const profile = await getUserProfile(id);

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const contributions = await getUserContributions(id);

    // Extract lastContributionAt from the most recent contribution's date
    let lastContributionAt: string | null = null;
    if (contributions.length > 0) {
      lastContributionAt = contributions[0].createdAt || contributions[0].date;
    }

    return NextResponse.json({ profile, contributions, lastContributionAt });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const newSection = body.section as Section;

    if (!newSection || !["contributors", "leaders"].includes(newSection)) {
      return NextResponse.json(
        { error: "section must be 'contributors' or 'leaders'" },
        { status: 400 }
      );
    }

    await changePersonSection(id, newSection);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error changing section:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    await deletePerson(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting person:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
