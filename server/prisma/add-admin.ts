import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function parseArg(name: string) {
  const prefix = `--${name}=`;
  const arg = process.argv.find(a => a.startsWith(prefix));
  if (arg) return arg.slice(prefix.length);
  return process.env[name.toUpperCase()];
}

async function main() {
  const email = parseArg('email') || 'admin2@example.com';
  const password = parseArg('password') || 'Admin2Pass123!';
  const name = parseArg('name') || 'Administrator 2';

  const hashed = bcrypt.hashSync(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'admin', name },
    create: { name, email, password: hashed, role: 'admin' },
  });

  console.log(`Admin upserted: ${email}`);
  console.log('If you provided a password via CLI or env, that password was used; otherwise a default was used.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
