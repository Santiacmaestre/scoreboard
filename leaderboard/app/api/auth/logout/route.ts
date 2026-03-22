import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const relogin = searchParams.get("relogin") === "true";

  const cognitoDomain = `https://${process.env.COGNITO_DOMAIN || "leaderboard-dev"}.auth.${process.env.APP_AWS_REGION || "us-west-2"}.amazoncognito.com`;
  const clientId = process.env.COGNITO_CLIENT_ID || "";
  const redirectTarget = relogin ? "/admin/login?relogin=true" : "/admin/login";
  const redirectUri = encodeURIComponent(`${process.env.NEXTAUTH_URL || ""}${redirectTarget}`);

  const cognitoLogoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${redirectUri}`;

  // Clear NextAuth session cookies server-side
  const cookieStore = await cookies();
  const nextAuthCookies = cookieStore.getAll().filter((c) =>
    c.name.startsWith("next-auth") || c.name.startsWith("__Secure-next-auth")
  );
  const response = NextResponse.redirect(cognitoLogoutUrl);
  for (const cookie of nextAuthCookies) {
    response.cookies.delete(cookie.name);
  }

  return response;
}
