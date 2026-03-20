import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/dynamodb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "leaders" | "contributors" | null;

  if (!type || !["leaders", "contributors"].includes(type)) {
    return NextResponse.json(
      { error: "Query param 'type' must be 'leaders' or 'contributors'" },
      { status: 400 }
    );
  }

  try {
    const data = await getLeaderboard(type);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
