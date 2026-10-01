const prisma = require("../prisma");

// Get all rooms belonging to the manager's hotel
const getManagerRooms = async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: {
        managerId: req.user.id,
      },
    });

    if (!hotel) {
      return res.status(404).json({
        status: "error",
        message: "Hotel not found",
      });
    }

    const rooms = await prisma.room.findMany({
      where: {
        hotelId: hotel.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      status: "success",
      rooms,
    });
  } catch (error) {
    console.error("Get manager rooms failed:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch rooms",
    });
  }
};

// Create a new room
const createManagerRoom = async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: {
        managerId: req.user.id,
      },
    });

    if (!hotel) {
      return res.status(404).json({
        status: "error",
        message: "Hotel not found",
      });
    }

    const { name, description, price, capacity, totalRooms, image } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      capacity === undefined ||
      totalRooms === undefined
    ) {
      return res.status(400).json({
        status: "error",
        message: "All required room fields must be provided",
      });
    }

    const room = await prisma.room.create({
      data: {
        hotelId: hotel.id,
        name,
        description,
        price: Number(price),
        capacity: Number(capacity),
        totalRooms: Number(totalRooms),
        image: image || "",
      },
    });

    res.status(201).json({
      status: "success",
      room,
    });
  } catch (error) {
    console.error("Create manager room failed:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to create room",
    });
  }
};

// Update a room
const updateManagerRoom = async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: {
        managerId: req.user.id,
      },
    });

    if (!hotel) {
      return res.status(404).json({
        status: "error",
        message: "Hotel not found",
      });
    }

    const roomId = Number(req.params.id);

    const existingRoom = await prisma.room.findFirst({
      where: {
        id: roomId,
        hotelId: hotel.id,
      },
    });

    if (!existingRoom) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
      });
    }

    const { name, description, price, capacity, totalRooms, image } = req.body;

    const room = await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        name,
        description,
        price: Number(price),
        capacity: Number(capacity),
        totalRooms: Number(totalRooms),
        image: image || "",
      },
    });

    res.json({
      status: "success",
      room,
    });
  } catch (error) {
    console.error("Update manager room failed:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to update room",
    });
  }
};

// Delete a room
const deleteManagerRoom = async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: {
        managerId: req.user.id,
      },
    });

    if (!hotel) {
      return res.status(404).json({
        status: "error",
        message: "Hotel not found",
      });
    }

    const roomId = Number(req.params.id);

    const existingRoom = await prisma.room.findFirst({
      where: {
        id: roomId,
        hotelId: hotel.id,
      },
    });

    if (!existingRoom) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
      });
    }

    await prisma.room.delete({
      where: {
        id: roomId,
      },
    });

    res.json({
      status: "success",
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Delete manager room failed:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to delete room",
    });
  }
};

module.exports = {
  getManagerRooms,
  createManagerRoom,
  updateManagerRoom,
  deleteManagerRoom,
};
