import { NextRequest, NextResponse } from "next/server";
import { deleteContribution } from "@/lib/dynamodb";
import { requireAuth } from "@/lib/auth-helpers";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  // id format: userId:contribId
  const [userId, contribId] = id.split(":");
  if (!userId || !contribId) {
    return NextResponse.json(
      { error: "Invalid id format. Expected userId:contribId" },
      { status: 400 }
    );
  }

  try {
    await deleteContribution(userId, contribId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting contribution:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
