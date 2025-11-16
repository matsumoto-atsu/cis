const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const rows = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`;
  console.log(rows);
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
