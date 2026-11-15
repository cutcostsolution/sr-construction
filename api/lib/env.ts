import "dotenv/config";

function get(name: string, fallback?: string): string {
  const value = process.env[name];
  if (!value && fallback !== undefined) return fallback;
  return value ?? "";
}

export const env = {
  appId: get("APP_ID", ""),
  appSecret: get("APP_SECRET", "sr-construction-default-secret-change-me"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: get("DATABASE_URL", ""),
  kimiAuthUrl: get("KIMI_AUTH_URL", ""),
  kimiOpenUrl: get("KIMI_OPEN_URL", ""),
  ownerUnionId: get("OWNER_UNION_ID", ""),
};
