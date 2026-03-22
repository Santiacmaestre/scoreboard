import { NextResponse } from "next/server";

export async function GET() {
  const cognitoDomain = `https://${process.env.COGNITO_DOMAIN || "leaderboard-dev"}.auth.${process.env.APP_AWS_REGION || "us-west-2"}.amazoncognito.com`;
  const clientId = process.env.COGNITO_CLIENT_ID || "";
  const redirectUri = encodeURIComponent(`${process.env.NEXTAUTH_URL || ""}/admin/login`);

  const cognitoLogoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${redirectUri}&redirect_uri=${redirectUri}&response_type=code`;

  return NextResponse.redirect(cognitoLogoutUrl);
}
