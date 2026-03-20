import { NextRequest, NextResponse } from "next/server";
import { searchPersons } from "@/lib/dynamodb";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  if (search.length < 2) {
    return NextResponse.json({ data: [] });
  }

  try {
    const data = await searchPersons(search);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error searching persons:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
