const prisma = require("../prisma");

const searchHotels = async ({ city, maxPrice, minRating }) => {
  const where = {};

  if (city) {
    where.city = {
      contains: city,
      mode: "insensitive",
    };
  }

  if (minRating) {
    where.rating = {
      gte: Number(minRating),
    };
  }

  const hotels = await prisma.hotel.findMany({
    where,
    include: {
      rooms: {
        select: {
          id: true,
          name: true,
          price: true,
          capacity: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      rating: "desc",
    },
  });

  let results = hotels;

  if (maxPrice) {
    results = results.filter((hotel) =>
      hotel.rooms.some((room) => room.price <= Number(maxPrice)),
    );
  }

  return results.map((hotel) => ({
    id: hotel.id,
    name: hotel.name,
    city: hotel.city,
    address: hotel.address,
    rating: hotel.rating,
    reviewCount: hotel.reviews.length,
    rooms: hotel.rooms,
  }));
};

const getHotelDetails = async ({ hotelId }) => {
  const hotel = await prisma.hotel.findUnique({
    where: {
      id: Number(hotelId),
    },
    include: {
      rooms: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          capacity: true,
          totalRooms: true,
        },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  return {
    id: hotel.id,
    name: hotel.name,
    description: hotel.description,
    address: hotel.address,
    city: hotel.city,
    country: hotel.country,
    rating: hotel.rating,
    rooms: hotel.rooms,
    reviews: hotel.reviews,
  };
};

const checkAvailability = async ({ roomId, checkIn, checkOut, guests }) => {
  const room = await prisma.room.findUnique({
    where: {
      id: Number(roomId),
    },
    include: {
      hotel: true,
      bookings: {
        where: {
          status: "CONFIRMED",
          checkIn: {
            lt: new Date(checkOut),
          },
          checkOut: {
            gt: new Date(checkIn),
          },
        },
      },
    },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  if (Number(guests) > room.capacity) {
    return {
      available: false,
      reason: `This room can accommodate a maximum of ${room.capacity} guests.`,
    };
  }

  const bookedRooms = room.bookings.length;
  const availableRooms = room.totalRooms - bookedRooms;

  return {
    available: availableRooms > 0,
    hotel: room.hotel.name,
    room: room.name,
    roomId: room.id,
    checkIn,
    checkOut,
    guests: Number(guests),
    pricePerNight: room.price,
    totalRooms: room.totalRooms,
    bookedRooms,
    availableRooms,
  };
};

module.exports = {
  searchHotels,
  getHotelDetails,
  checkAvailability,
};
