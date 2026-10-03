const prisma = require("../prisma");

const validateBookingDates = (checkIn, checkOut, guests) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (Number.isNaN(checkInDate.getTime())) {
    throw new Error("Invalid check-in date.");
  }

  if (Number.isNaN(checkOutDate.getTime())) {
    throw new Error("Invalid check-out date.");
  }

  if (checkOutDate <= checkInDate) {
    throw new Error("Check-out date must be after check-in date.");
  }

  if (Number(guests) < 1) {
    throw new Error("Guests must be at least 1.");
  }

  return {
    checkInDate,
    checkOutDate,
  };
};

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
  const { checkInDate, checkOutDate } = validateBookingDates(
    checkIn,
    checkOut,
    guests,
  );

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
            lt: checkOutDate,
          },
          checkOut: {
            gt: checkInDate,
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

const searchAvailableRooms = async ({
  hotelId,
  checkIn,
  checkOut,
  guests,
  maxPrice,
}) => {
  const { checkInDate, checkOutDate } = validateBookingDates(
    checkIn,
    checkOut,
    guests,
  );

  const rooms = await prisma.room.findMany({
    where: {
      hotelId: Number(hotelId),
      capacity: {
        gte: Number(guests),
      },
      ...(maxPrice
        ? {
            price: {
              lte: Number(maxPrice),
            },
          }
        : {}),
    },
    include: {
      hotel: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
      bookings: {
        where: {
          status: "CONFIRMED",
          checkIn: {
            lt: checkOutDate,
          },
          checkOut: {
            gt: checkInDate,
          },
        },
      },
    },
  });

  return rooms
    .filter((room) => room.bookings.length < room.totalRooms)
    .map((room) => ({
      hotelId: room.hotel.id,
      hotel: room.hotel.name,
      city: room.hotel.city,
      roomId: room.id,
      room: room.name,
      description: room.description,
      pricePerNight: room.price,
      capacity: room.capacity,
      totalRooms: room.totalRooms,
      bookedRooms: room.bookings.length,
      availableRooms: room.totalRooms - room.bookings.length,
      checkIn,
      checkOut,
      guests: Number(guests),
    }));
};

module.exports = {
  searchHotels,
  getHotelDetails,
  checkAvailability,
  searchAvailableRooms,
};
