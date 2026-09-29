const prisma = require("../src/prisma");

async function main() {
  const manager = await prisma.user.findUnique({
    where: {
      email: "manager@staynest.com",
    },
  });

  if (!manager) {
    throw new Error("Hotel manager not found");
  }

  const hotel = await prisma.hotel.findUnique({
    where: {
      id: 1,
    },
  });

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  await prisma.hotel.update({
    where: {
      id: hotel.id,
    },
    data: {
      managerId: manager.id,
    },
  });

  console.log(`${hotel.name} assigned to ${manager.email}`);
}

main()
  .catch((error) => {
    console.error("Failed to assign hotel manager:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
