(async () => {
  try {
    // Use dynamic import (ESM) to load the generated Prisma client
    const clientModule = await import('./server/node_modules/@prisma/client/index.js');
    const { PrismaClient } = clientModule;
    const prisma = new PrismaClient();
    await prisma.$connect();
    const clubs = await prisma.club.findMany();
    console.log('DB_OK', clubs.length);
    await prisma.$disconnect();
  } catch (e) {
    console.error('DB_ERR', e && e.message);
    console.error(e && e.stack);
    process.exitCode = 1;
  }
})();
