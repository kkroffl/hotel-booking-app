const prisma = require("../src/prisma");

// Sample room data for our existing hotels.
// hotelId connects each room to a hotel in the Hotel table.
const rooms = [
  // StayNest Grand Chennai
  {
    hotelId: 1,
    name: "Deluxe Room",
    description: "Spacious room with a comfortable bed and modern amenities.",
    price: 4500,
    capacity: 2,
    totalRooms: 10,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  },
  {
    hotelId: 1,
    name: "Executive Suite",
    description: "Premium suite with extra space and upgraded facilities.",
    price: 7000,
    capacity: 3,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  },

  // StayNest Marina
  {
    hotelId: 2,
    name: "Ocean View Room",
    description: "Comfortable room with a relaxing coastal atmosphere.",
    price: 5500,
    capacity: 2,
    totalRooms: 8,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
  },
  {
    hotelId: 2,
    name: "Premium Suite",
    description: "Large premium suite designed for a luxurious stay.",
    price: 8500,
    capacity: 4,
    totalRooms: 4,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },

  // StayNest City Palace
  {
    hotelId: 3,
    name: "Standard Room",
    description: "Affordable and comfortable room for everyday travelers.",
    price: 3800,
    capacity: 2,
    totalRooms: 12,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
  },
  {
    hotelId: 3,
    name: "Royal Suite",
    description: "Elegant suite with spacious interiors and premium amenities.",
    price: 7500,
    capacity: 4,
    totalRooms: 6,
    image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897",
  },
];

async function main() {
  await prisma.room.createMany({
    data: rooms,
  });

  console.log(`${rooms.length} rooms added successfully`);
}

main()
  .catch((error) => {
    console.error("Failed to seed rooms:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
