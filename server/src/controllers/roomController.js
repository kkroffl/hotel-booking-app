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
    // Get the hotel ID from the URL
    const hotelId = Number(req.params.hotelId);

    const rooms = await prisma.room.findMany({
      where: {
        hotelId: hotelId,
      },

      // Show cheaper rooms first
      orderBy: {
        price: "asc",
      },
    });

    res.json({
      status: "success",
      count: rooms.length,
      rooms,
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
