const prisma = require("../prisma");

// Get all rooms from the database
const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      // Show newest rooms first
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      status: "success",
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Failed to fetch rooms:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch rooms",
    });
  }
};

// Get all rooms belonging to one specific hotel
const getRoomsByHotel = async (req, res) => {
  try {
    const hotelId = Number(req.params.hotelId);

    const { checkIn, checkOut } = req.query;

    const rooms = await prisma.room.findMany({
      where: { hotelId },
      orderBy: { price: "asc" },
    });

    const formattedRooms = await Promise.all(
      rooms.map(async (room) => {
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
      count: formattedRooms.length,
      rooms: formattedRooms,
    });
  } catch (error) {
    console.error("Failed to fetch hotel rooms:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch hotel rooms",
    });
  }
};

module.exports = {
  getRooms,
  getRoomsByHotel,
};
