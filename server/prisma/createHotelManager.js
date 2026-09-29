const bcrypt = require("bcryptjs");
const prisma = require("../src/prisma");

async function main() {
  const hashedPassword = await bcrypt.hash("manager123", 10);

  const manager = await prisma.user.upsert({
    where: {
      email: "manager@staynest.com",
    },
    update: {
      role: "HOTEL_MANAGER",
    },
    create: {
      name: "StayNest Hotel Manager",
      email: "manager@staynest.com",
      password: hashedPassword,
      role: "HOTEL_MANAGER",
    },
  });

  console.log("Hotel Manager created:");
  console.log(manager.email);
  console.log("Role:", manager.role);
}

main()
  .catch((error) => {
    console.error("Failed to create hotel manager:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
