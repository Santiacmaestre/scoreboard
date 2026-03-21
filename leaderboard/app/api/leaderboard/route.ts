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
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error fetching leaderboard:", errMsg, {
      table: process.env.DYNAMODB_TABLE_NAME,
      region: process.env.APP_AWS_REGION || process.env.AWS_REGION,
    });
    return NextResponse.json(
      { error: `Leaderboard error: ${errMsg}` },
      { status: 500 }
    );
  }
}
