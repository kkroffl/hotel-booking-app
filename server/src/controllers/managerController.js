const prisma = require("../prisma");

const getManagerHotel = async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: {
        managerId: req.user.id,
      },
      include: {
        rooms: true,
        reviews: true,
      },
    });

    if (!hotel) {
      return res.status(404).json({
        status: "error",
        message: "No hotel is assigned to this manager",
      });
    }

    res.json({
      status: "success",
      hotel,
    });
  } catch (error) {
    console.error("Failed to fetch manager hotel:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch manager hotel",
    });
  }
};

const getManagerDashboard = async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: {
        managerId: req.user.id,
      },
    });

    if (!hotel) {
      return res.status(404).json({
        status: "error",
        message: "No hotel is assigned to this manager",
      });
    }

    const [roomCount, bookingCount, reviewCount, bookings] = await Promise.all([
      prisma.room.count({
        where: {
          hotelId: hotel.id,
        },
      }),

      prisma.booking.count({
        where: {
          room: {
            hotelId: hotel.id,
          },
        },
      }),

      prisma.review.count({
        where: {
          hotelId: hotel.id,
        },
      }),

      prisma.booking.findMany({
        where: {
          room: {
            hotelId: hotel.id,
          },
        },
        include: {
          room: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const totalRevenue = bookings
      .filter((booking) => booking.status !== "CANCELLED")
      .reduce((total, booking) => total + booking.totalPrice, 0);

    const uniqueGuests = new Set(bookings.map((booking) => booking.userId))
      .size;

    res.json({
      status: "success",
      dashboard: {
        hotel,
        stats: {
          rooms: roomCount,
          bookings: bookingCount,
          reviews: reviewCount,
          guests: uniqueGuests,
          revenue: totalRevenue,
        },
        bookings,
      },
    });
  } catch (error) {
    console.error("Failed to fetch manager dashboard:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch manager dashboard",
    });
  }
};

module.exports = {
  getManagerHotel,
  getManagerDashboard,
};
