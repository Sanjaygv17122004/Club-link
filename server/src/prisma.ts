import { PrismaClient } from '@prisma/client';

// single Prisma client instance
export const prisma = new PrismaClient();

// optional helper to disconnect on shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
