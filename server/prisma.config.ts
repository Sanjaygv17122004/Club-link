// Load .env early so Prisma CLI and tools that import this config
// will see environment variables from `server/.env` automatically.
// Use ESM-style import which works with TypeScript and avoids require.
import "dotenv/config";

import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Use env() helper which will now find DATABASE_URL from .env
    url: env("DATABASE_URL"),
  },
});
