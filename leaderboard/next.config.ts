import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: [
    "@aws-sdk/client-dynamodb",
    "@aws-sdk/lib-dynamodb",
  ],
  // Inline server-side env vars at build time so they survive
  // Next.js standalone mode (Amplify SSR may not inject them at runtime)
  env: {
    DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
    APP_AWS_REGION: process.env.APP_AWS_REGION,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
    COGNITO_ISSUER: process.env.COGNITO_ISSUER,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
    COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,
  },
};

export default nextConfig;
