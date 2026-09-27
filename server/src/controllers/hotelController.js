const prisma = require("../prisma");

// Get all hotels from the database
const getHotels = async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany({
      // Include the rooms belonging to each hotel
      include: {
        rooms: true,
      },

      // Show newest hotels first
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add a frontend-friendly location and starting price
    const formattedHotels = hotels.map((hotel) => {
      // Find the cheapest room for this hotel
      const cheapestRoom =
        hotel.rooms.length > 0
          ? Math.min(...hotel.rooms.map((room) => room.price))
          : null;

      return {
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,

        // Combine city and country for the frontend
        location: `${hotel.city}, ${hotel.country}`,

        address: hotel.address,
        city: hotel.city,
        country: hotel.country,

        latitude: hotel.latitude,
        longitude: hotel.longitude,

        image: hotel.image,
        rating: hotel.rating,

        // Starting price shown on the hotel card
        startingPrice: cheapestRoom,

        // Keep the complete room information available
        rooms: hotel.rooms,
      };
    });

    res.json({
      status: "success",
      count: formattedHotels.length,
      hotels: formattedHotels,
    });
  } catch (error) {
    console.error("Failed to fetch hotels:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch hotels",
    });
  }
};

// Get one hotel along with all of its rooms
const getHotelById = async (req, res) => {
  try {
    const hotelId = Number(req.params.id);

    const { checkIn, checkOut } = req.query;

    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: { rooms: true },
    });

    if (!hotel) {
      return res.status(404).json({
        status: "error",
        message: "Hotel not found",
      });
    }

    const rooms = await Promise.all(
      hotel.rooms.map(async (room) => {
        let availableRooms = room.totalRooms;

        if (checkIn && checkOut) {
          const startDate = new Date(checkIn);
          const endDate = new Date(checkOut);

          if (
            !Number.isNaN(startDate.getTime()) &&
            !Number.isNaN(endDate.getTime()) &&
            startDate < endDate
          ) {
            const overlappingBookings = await prisma.booking.count({
              where: {
                roomId: room.id,
                status: "CONFIRMED",
                checkIn: {
                  lt: endDate,
                },
                checkOut: {
                  gt: startDate,
                },
              },
            });

            availableRooms = Math.max(room.totalRooms - overlappingBookings, 0);
          }
        }

        return {
          ...room,
          availableRooms,
        };
      }),
    );

    res.json({
      status: "success",
      hotel: {
        ...hotel,
        rooms,
      },
    });
  } catch (error) {
    console.error("Failed to fetch hotel:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch hotel",
    });
  }
};

module.exports = {
  getHotels,
  getHotelById,
};
