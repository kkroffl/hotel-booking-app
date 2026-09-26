const prisma = require("../prisma");

// Get all bookings from the database
const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      // Include the user who made the booking
      include: {
        user: true,

        // Include the booked room and its hotel
        room: {
          include: {
            hotel: true,
          },
        },
      },

      // Show newest bookings first
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      status: "success",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch bookings",
    });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { userId, roomId, checkIn, checkOut, guests } = req.body;

    // Make sure all required information was provided
    if (!userId || !roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        status: "error",
        message: "All booking details are required",
      });
    }

    // Check whether the room exists
    const room = await prisma.room.findUnique({
      where: {
        id: Number(roomId),
      },
    });

    if (!room) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
      });
    }

    // Check whether the user exists
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Convert the dates into JavaScript Date objects
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    // Make sure checkout is after check-in
    if (endDate <= startDate) {
      return res.status(400).json({
        status: "error",
        message: "Check-out date must be after check-in date",
      });
    }

    // Check whether this room already has a booking
    // that overlaps with the requested dates.
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        roomId: Number(roomId),

        // An existing booking overlaps when:
        // existing check-in  < requested check-out
        // AND
        // existing check-out > requested check-in
        checkIn: {
          lt: endDate,
        },
        checkOut: {
          gt: startDate,
        },

        // Only confirmed bookings should block the room
        status: "CONFIRMED",
      },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        status: "error",
        message: "Room is already booked for the selected dates",
      });
    }

    // Calculate the number of nights
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((endDate - startDate) / millisecondsPerDay);

    // Calculate the total booking price
    const totalPrice = nights * room.price;

    // Create the booking in PostgreSQL
    const booking = await prisma.booking.create({
      data: {
        userId: Number(userId),
        roomId: Number(roomId),
        checkIn: startDate,
        checkOut: endDate,
        guests: Number(guests),
        totalPrice,
        status: "CONFIRMED",
      },

      // Return useful related information
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });

    res.status(201).json({
      status: "success",
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Failed to create booking:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to create booking",
    });
  }
};

// Get all bookings belonging to one specific user
const getBookingsByUser = async (req, res) => {
  try {
    // Get the user ID from the URL
    const userId = Number(req.params.userId);

    // Find all bookings made by this user
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },

      // Include the booked room and its hotel
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },

      // Show newest bookings first
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      status: "success",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Failed to fetch user bookings:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch user bookings",
    });
  }
};

// Cancel an existing booking
const cancelBooking = async (req, res) => {
  try {
    // Get the booking ID from the URL
    const bookingId = Number(req.params.id);

    // Find the booking first
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    // Make sure the booking exists
    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    // Don't allow an already cancelled booking to be cancelled again
    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        status: "error",
        message: "Booking is already cancelled",
      });
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    res.json({
      status: "success",
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Failed to cancel booking:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to cancel booking",
    });
  }
};

module.exports = {
  getBookings,
  getBookingsByUser,
  createBooking,
  cancelBooking,
};
