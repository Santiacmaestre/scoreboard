import { NextResponse } from "next/server";

export async function GET() {
  const cognitoDomain = `https://${process.env.COGNITO_DOMAIN || "leaderboard-dev"}.auth.${process.env.APP_AWS_REGION || "us-west-2"}.amazoncognito.com`;
  const clientId = process.env.COGNITO_CLIENT_ID || "";
  const logoutUri = encodeURIComponent(`${process.env.NEXTAUTH_URL || ""}/`);

  const cognitoLogoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;

  return NextResponse.redirect(cognitoLogoutUrl);
}
