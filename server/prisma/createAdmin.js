const bcrypt = require("bcryptjs");
const prisma = require("../src/prisma");

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@staynest.com",
    },
    update: {
      role: "ADMIN",
    },
    create: {
      name: "StayNest Admin",
      email: "admin@staynest.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created:");
  console.log(admin.email);
  console.log("Role:", admin.role);
}

main()
  .catch((error) => {
    console.error("Failed to create admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
