import { NextRequest, NextResponse } from "next/server";
import { updateContributionType, deactivateContributionType } from "@/lib/dynamodb";
import { requireAuth } from "@/lib/auth-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { slug } = await params;

  try {
    const body = await request.json();
    await updateContributionType(slug, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating type:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { slug } = await params;

  try {
    await deactivateContributionType(slug);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deactivating type:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
