import type { AuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "aiawsugcolombia@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export function isAllowedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export const authOptions: AuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
      checks: ["nonce"],
      // prompt=select_account is already configured at the Google IdP level
      // in Terraform (cognito.tf authorize_url). No need to set prompt here —
      // doing so interferes with Cognito's nonce validation.
    }),
  ],
  callbacks: {
    // Allow ALL authenticated users through signIn —
    // admin vs non-admin is handled by middleware, not here.
    // This ensures non-admins get a valid session so we can show their email.
    async signIn() {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.isAdmin = isAllowedAdmin(user.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session as any).isAdmin = token.isAdmin as boolean;
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
