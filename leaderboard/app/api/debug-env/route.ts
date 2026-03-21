import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL || "NOT SET",
    hasCognitoClientId: !!process.env.COGNITO_CLIENT_ID,
    hasCognitoClientSecret: !!process.env.COGNITO_CLIENT_SECRET,
    hasCognitoIssuer: !!process.env.COGNITO_ISSUER,
    cognitoIssuer: process.env.COGNITO_ISSUER || "NOT SET",
    nodeEnv: process.env.NODE_ENV,
  });
}
