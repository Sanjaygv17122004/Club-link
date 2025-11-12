import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminPass123!';

  const hashed = bcrypt.hashSync(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Administrator',
      email: adminEmail,
      password: hashed,
      role: 'admin',
    },
  });

  // create some example clubs
  const clubs = [
    { name: 'Chess Club', description: 'Strategy and tournaments' },
    { name: 'Robotics Club', description: 'Robotics projects and competitions' },
    { name: 'Photography Club', description: 'Photo walks and editing workshops' },
  ];

  for (const c of clubs) {
    await prisma.club.upsert({
      where: { name: c.name },
      update: {},
      create: { name: c.name, description: c.description, createdBy: admin.id },
    });
  }

  console.log('Seed finished. Admin:', adminEmail);
  console.log('Admin password (if not set by env):', process.env.SEED_ADMIN_PASSWORD ? '(from env)' : adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
