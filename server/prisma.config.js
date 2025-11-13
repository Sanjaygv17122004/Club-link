"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Load .env early so Prisma CLI and tools that import this config
// will see environment variables from `server/.env` automatically.
// Use ESM-style import which works with TypeScript and avoids require.
require("dotenv/config");
const config_1 = require("@prisma/config");
module.exports = (0, config_1.defineConfig)({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    engine: "classic",
    datasource: {
        // Use env() helper which will now find DATABASE_URL from .env
        url: (0, config_1.env)("DATABASE_URL"),
    },
});
//# sourceMappingURL=prisma.config.js.map