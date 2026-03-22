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

  // Clear ALL auth-related cookies server-side
  const cookieStore = await cookies();
  const response = NextResponse.redirect(cognitoLogoutUrl);

  for (const cookie of cookieStore.getAll()) {
    if (
      cookie.name.startsWith("next-auth") ||
      cookie.name.startsWith("__Secure-next-auth") ||
      cookie.name.startsWith("__Host-next-auth") ||
      cookie.name.includes("cognito") ||
      cookie.name.includes("XSRF") ||
      cookie.name.includes("csrf")
    ) {
      response.cookies.delete(cookie.name);
    }
  }

  return response;
}
