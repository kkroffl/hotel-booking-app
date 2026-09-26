const prisma = require("../src/prisma");

// Development user for testing the booking system.
// Authentication will be implemented later.
const user = {
  name: "Test User",
  email: "test@staynest.com",
  password: "test123",
  role: "USER",
};

async function main() {
  // Check if the test user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  // Avoid creating duplicate users if the script is run again
  if (existingUser) {
    console.log("Test user already exists");
    return;
  }

  await prisma.user.create({
    data: user,
  });

  console.log("Test user created successfully");
}

main()
  .catch((error) => {
    console.error("Failed to create test user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
