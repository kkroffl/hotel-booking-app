const prisma = require("../src/prisma");

const rooms = [
  // StayNest Grand Chennai
  {
    hotelName: "StayNest Grand Chennai",
    name: "Deluxe Room",
    description: "Spacious room with a comfortable bed and modern amenities.",
    price: 4500,
    capacity: 2,
    totalRooms: 10,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  },
  {
    hotelName: "StayNest Grand Chennai",
    name: "Executive Suite",
    description: "Premium suite with extra space and upgraded facilities.",
    price: 7000,
    capacity: 3,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  },

  // StayNest Marina
  {
    hotelName: "StayNest Marina",
    name: "Ocean View Room",
    description: "Comfortable room with a relaxing coastal atmosphere.",
    price: 5500,
    capacity: 2,
    totalRooms: 8,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
  },
  {
    hotelName: "StayNest Marina",
    name: "Premium Suite",
    description: "Large premium suite designed for a luxurious stay.",
    price: 8500,
    capacity: 4,
    totalRooms: 4,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },

  // StayNest City Palace
  {
    hotelName: "StayNest City Palace",
    name: "Standard Room",
    description: "Affordable and comfortable room for everyday travelers.",
    price: 3800,
    capacity: 2,
    totalRooms: 12,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
  },
  {
    hotelName: "StayNest City Palace",
    name: "Royal Suite",
    description: "Elegant suite with spacious interiors and premium amenities.",
    price: 7500,
    capacity: 4,
    totalRooms: 6,
    image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897",
  },

  // StayNest Royal Mumbai
  {
    hotelName: "StayNest Royal Mumbai",
    name: "Deluxe City Room",
    description: "Modern room with comfortable furnishings and city views.",
    price: 6000,
    capacity: 2,
    totalRooms: 10,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  },
  {
    hotelName: "StayNest Royal Mumbai",
    name: "Luxury Suite",
    description: "Spacious luxury suite with premium amenities.",
    price: 9500,
    capacity: 4,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  },

  // StayNest Bengaluru Heights
  {
    hotelName: "StayNest Bengaluru Heights",
    name: "Business Room",
    description: "Comfortable room designed for business and short stays.",
    price: 4800,
    capacity: 2,
    totalRooms: 12,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
  },
  {
    hotelName: "StayNest Bengaluru Heights",
    name: "Executive Suite",
    description:
      "Elegant suite with additional living space and premium facilities.",
    price: 7800,
    capacity: 3,
    totalRooms: 6,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },

  // StayNest Hyderabad Central
  {
    hotelName: "StayNest Hyderabad Central",
    name: "Comfort Room",
    description:
      "Modern and comfortable room suitable for business and leisure.",
    price: 4200,
    capacity: 2,
    totalRooms: 10,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
  },
  {
    hotelName: "StayNest Hyderabad Central",
    name: "Premium Suite",
    description:
      "Spacious suite with upgraded amenities and elegant interiors.",
    price: 7200,
    capacity: 4,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897",
  },

  // StayNest Delhi Grand
  {
    hotelName: "StayNest Delhi Grand",
    name: "Classic Room",
    description: "Comfortable room with modern facilities for city travelers.",
    price: 5000,
    capacity: 2,
    totalRooms: 12,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  },
  {
    hotelName: "StayNest Delhi Grand",
    name: "Grand Suite",
    description: "Luxury suite with spacious interiors and premium amenities.",
    price: 9000,
    capacity: 4,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  },

  // StayNest Jaipur Palace
  {
    hotelName: "StayNest Jaipur Palace",
    name: "Heritage Room",
    description: "Elegant heritage-inspired room with traditional decor.",
    price: 5500,
    capacity: 2,
    totalRooms: 8,
    image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897",
  },
  {
    hotelName: "StayNest Jaipur Palace",
    name: "Royal Suite",
    description:
      "Luxurious royal suite with spacious interiors and premium facilities.",
    price: 10000,
    capacity: 4,
    totalRooms: 4,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },

  // StayNest Kochi Waterfront
  {
    hotelName: "StayNest Kochi Waterfront",
    name: "Waterfront Room",
    description:
      "Relaxing room with comfortable interiors and waterfront atmosphere.",
    price: 5200,
    capacity: 2,
    totalRooms: 10,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
  },
  {
    hotelName: "StayNest Kochi Waterfront",
    name: "Family Suite",
    description: "Spacious suite designed for comfortable family stays.",
    price: 7800,
    capacity: 4,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
  },

  // StayNest Goa Resort
  {
    hotelName: "StayNest Goa Resort",
    name: "Garden Room",
    description:
      "Comfortable room surrounded by a peaceful tropical atmosphere.",
    price: 5000,
    capacity: 2,
    totalRooms: 12,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  },
  {
    hotelName: "StayNest Goa Resort",
    name: "Poolside Suite",
    description: "Premium suite offering a relaxing resort experience.",
    price: 8500,
    capacity: 4,
    totalRooms: 6,
    image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897",
  },

  // StayNest Singapore
  {
    hotelName: "StayNest Singapore",
    name: "City Room",
    description:
      "Modern room offering comfortable accommodation in central Singapore.",
    price: 9000,
    capacity: 2,
    totalRooms: 10,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },
  {
    hotelName: "StayNest Singapore",
    name: "Executive Suite",
    description:
      "Premium suite with elegant interiors and additional living space.",
    price: 14000,
    capacity: 4,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  },

  // StayNest Dubai Marina
  {
    hotelName: "StayNest Dubai Marina",
    name: "Marina View Room",
    description:
      "Luxury room offering comfortable accommodation and marina views.",
    price: 11000,
    capacity: 2,
    totalRooms: 10,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  },
  {
    hotelName: "StayNest Dubai Marina",
    name: "Luxury Suite",
    description:
      "Spacious luxury suite with premium facilities and stunning views.",
    price: 18000,
    capacity: 4,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
  },

  // StayNest London Central
  {
    hotelName: "StayNest London Central",
    name: "Classic Room",
    description:
      "Stylish room offering comfortable accommodation in central London.",
    price: 12000,
    capacity: 2,
    totalRooms: 10,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
  },
  {
    hotelName: "StayNest London Central",
    name: "Executive Suite",
    description: "Elegant suite with spacious interiors and premium amenities.",
    price: 19000,
    capacity: 4,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  },

  // StayNest Paris
  {
    hotelName: "StayNest Paris",
    name: "Parisian Room",
    description:
      "Elegant room combining classic Parisian style with modern comfort.",
    price: 13000,
    capacity: 2,
    totalRooms: 8,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  },
  {
    hotelName: "StayNest Paris",
    name: "Luxury Suite",
    description: "Spacious premium suite designed for a memorable Paris stay.",
    price: 21000,
    capacity: 4,
    totalRooms: 4,
    image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897",
  },

  // StayNest New York
  {
    hotelName: "StayNest New York",
    name: "Manhattan Room",
    description: "Modern room offering comfortable accommodation in Manhattan.",
    price: 15000,
    capacity: 2,
    totalRooms: 10,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
  },
  {
    hotelName: "StayNest New York",
    name: "Penthouse Suite",
    description: "Premium suite with spacious interiors and upscale amenities.",
    price: 25000,
    capacity: 4,
    totalRooms: 4,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },

  // StayNest Tokyo
  {
    hotelName: "StayNest Tokyo",
    name: "Modern Room",
    description:
      "Compact and comfortable room inspired by modern Japanese design.",
    price: 10000,
    capacity: 2,
    totalRooms: 12,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
  },
  {
    hotelName: "StayNest Tokyo",
    name: "Premium Suite",
    description: "Elegant suite combining Japanese design with modern luxury.",
    price: 16000,
    capacity: 4,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897",
  },

  // StayNest Bangkok
  {
    hotelName: "StayNest Bangkok",
    name: "City Room",
    description: "Comfortable modern room in the heart of Bangkok.",
    price: 6000,
    capacity: 2,
    totalRooms: 12,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  },
  {
    hotelName: "StayNest Bangkok",
    name: "Executive Suite",
    description: "Spacious suite with premium facilities and modern interiors.",
    price: 9500,
    capacity: 4,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  },

  // StayNest Bali Resort
  {
    hotelName: "StayNest Bali Resort",
    name: "Garden Villa",
    description:
      "Peaceful villa surrounded by tropical gardens and natural scenery.",
    price: 9000,
    capacity: 2,
    totalRooms: 10,
    image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897",
  },
  {
    hotelName: "StayNest Bali Resort",
    name: "Private Pool Villa",
    description:
      "Luxury villa offering a private pool and premium resort amenities.",
    price: 16000,
    capacity: 4,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },

  // StayNest Sydney Harbour
  {
    hotelName: "StayNest Sydney Harbour",
    name: "Harbour View Room",
    description:
      "Modern room offering comfortable accommodation with harbour views.",
    price: 14000,
    capacity: 2,
    totalRooms: 10,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
  },
  {
    hotelName: "StayNest Sydney Harbour",
    name: "Harbour Suite",
    description:
      "Premium suite with spacious interiors and beautiful harbour views.",
    price: 22000,
    capacity: 4,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
  },

  // StayNest Toronto
  {
    hotelName: "StayNest Toronto",
    name: "Downtown Room",
    description: "Modern room designed for comfortable city stays.",
    price: 11000,
    capacity: 2,
    totalRooms: 10,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
  },
  {
    hotelName: "StayNest Toronto",
    name: "Premium Suite",
    description:
      "Spacious suite with upgraded facilities and modern furnishings.",
    price: 17000,
    capacity: 4,
    totalRooms: 5,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  },
];

async function main() {
  for (const room of rooms) {
    const hotel = await prisma.hotel.findFirst({
      where: {
        name: room.hotelName,
      },
    });

    if (!hotel) {
      throw new Error(`Hotel not found: ${room.hotelName}`);
    }

    await prisma.room.create({
      data: {
        hotelId: hotel.id,
        name: room.name,
        description: room.description,
        price: room.price,
        capacity: room.capacity,
        totalRooms: room.totalRooms,
        image: room.image,
      },
    });
  }

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
