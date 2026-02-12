import { PrismaClient } from "@/app/generated/prisma/client/client";
import { PrismaPg } from "@prisma/adapter-pg";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is undefined");
  process.exit(1);
}
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
process.env.NODE_ENV !== "production" && (globalForPrisma.prisma = prisma);
