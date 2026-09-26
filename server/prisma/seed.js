const prisma = require("../src/prisma");

const hotels = [
  {
    name: "StayNest Grand Chennai",
    description:
      "A modern luxury hotel with comfortable rooms and premium amenities.",
    address: "OMR Road",
    city: "Chennai",
    country: "India",
    latitude: 12.8406,
    longitude: 80.1534,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rating: 4.5,
  },
  {
    name: "StayNest Marina",
    description:
      "A stylish hotel offering a relaxing stay near the heart of the city.",
    address: "Marina Beach Road",
    city: "Chennai",
    country: "India",
    latitude: 13.05,
    longitude: 80.2824,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
    rating: 4.3,
  },
  {
    name: "StayNest City Palace",
    description:
      "A comfortable city hotel designed for both business and leisure travelers.",
    address: "Anna Salai",
    city: "Chennai",
    country: "India",
    latitude: 13.0569,
    longitude: 80.2425,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    rating: 4.6,
  },
];

async function main() {
  await prisma.hotel.createMany({
    data: hotels,
  });

  console.log(`${hotels.length} hotels added successfully`);
}

main()
  .catch((error) => {
    console.error("Failed to seed hotels:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
