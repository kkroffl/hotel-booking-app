const prisma = require("../prisma");

const getDashboardStats = async (req, res) => {
  try {
    const [hotelCount, roomCount, bookingCount, userCount, reviewCount] =
      await Promise.all([
        prisma.hotel.count(),
        prisma.room.count(),
        prisma.booking.count(),
        prisma.user.count(),
        prisma.review.count(),
      ]);

    res.json({
      status: "success",
      stats: {
        hotels: hotelCount,
        rooms: roomCount,
        bookings: bookingCount,
        users: userCount,
        reviews: reviewCount,
      },
    });
  } catch (error) {
    console.error("Failed to fetch admin dashboard stats:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};
