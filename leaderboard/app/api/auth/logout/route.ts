import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const region = process.env.APP_AWS_REGION || "us-west-2";
  const cognitoDomain = `https://${process.env.COGNITO_DOMAIN || "leaderboard-dev"}.auth.${region}.amazoncognito.com`;
  const clientId = process.env.COGNITO_CLIENT_ID || "";
  const logoutRedirect = `${process.env.NEXTAUTH_URL || ""}/admin/login`;
  const redirectUri = encodeURIComponent(logoutRedirect);

  // Cognito logout URL — clears Cognito session and redirects back to our login page
  const cognitoLogoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${redirectUri}`;

  const response = NextResponse.redirect(cognitoLogoutUrl);

  // Clear ALL cookies — use explicit path "/" so the browser actually removes them.
  // Without matching the path, the browser ignores the Set-Cookie delete.
  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    response.cookies.set(cookie.name, "", {
      expires: new Date(0),
      path: "/",
    });
  }

  return response;
}
