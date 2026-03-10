import "dotenv/config";
import { prisma } from "../src/utils/lib/prisma";
import bcrypt from "bcryptjs";

const main = async () => {
  try {
    console.log("🔄 Starting seed...");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        username: "admin",
        email: "admin@example.com",
        password: adminPassword,
        isAdmin: true,
      },
    });

    console.log("✅ Admin user created:", adminUser);

    // Create regular user
    const userPassword = await bcrypt.hash("user123", 10);
    const regularUser = await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        username: "john",
        email: "user@example.com",
        password: userPassword,
        isAdmin: false,
      },
    });

    console.log("✅ Regular user created:", regularUser);
  } catch (e) {
    console.error("❌ Error:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
