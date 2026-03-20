import { NextRequest, NextResponse } from "next/server";
import { getContributionTypes, createContributionType } from "@/lib/dynamodb";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const data = await getContributionTypes(true);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error fetching types:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();

    if (!body.name || !body.slug || !body.appliesTo || !body.colorDot || !body.colorBadgeBg || !body.colorBadgeText) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, appliesTo, colorDot, colorBadgeBg, colorBadgeText" },
        { status: 400 }
      );
    }

    const type = await createContributionType(body);
    return NextResponse.json({ data: type }, { status: 201 });
  } catch (err) {
    console.error("Error creating type:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
