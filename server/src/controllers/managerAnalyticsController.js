const prisma = require("../prisma");

const getManagerAnalytics = async (req, res) => {
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
    });

    const bookings = await prisma.booking.findMany({
      where: {
        room: {
          hotelId: hotel.id,
        },
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const reviews = await prisma.review.findMany({
      where: {
        hotelId: hotel.id,
      },
      select: {
        rating: true,
      },
    });

    // Basic statistics
    const totalBookings = bookings.length;

    const totalRevenue = bookings
      .filter((booking) => booking.status !== "CANCELLED")
      .reduce((total, booking) => total + booking.totalPrice, 0);

    const completedBookings = bookings.filter(
      (booking) => booking.status === "COMPLETED",
    ).length;

    const confirmedBookings = bookings.filter(
      (booking) => booking.status === "CONFIRMED",
    ).length;

    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "CANCELLED",
    ).length;

    const uniqueGuests = new Set(
      bookings
        .filter((booking) => booking.status !== "CANCELLED")
        .map((booking) => booking.userId),
    ).size;

    const averageBookingValue =
      totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Last 30 days occupancy
    const now = new Date();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    let bookedRoomNights = 0;

    bookings
      .filter((booking) => booking.status !== "CANCELLED")
      .forEach((booking) => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);

        const start = checkIn > thirtyDaysAgo ? checkIn : thirtyDaysAgo;

        const end = checkOut < now ? checkOut : now;

        if (end > start) {
          const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

          bookedRoomNights += nights;
        }
      });

    const totalRoomCount = rooms.reduce(
      (total, room) => total + room.totalRooms,
      0,
    );

    const availableRoomNights = totalRoomCount * 30;

    const occupancyRate =
      availableRoomNights > 0
        ? Math.min(100, (bookedRoomNights / availableRoomNights) * 100)
        : 0;

    // Booking status breakdown
    const bookingStatus = {
      confirmed: confirmedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
    };

    // Last 6 months
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const year = date.getFullYear();
      const month = date.getMonth();

      const monthBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.createdAt);

        return (
          bookingDate.getFullYear() === year && bookingDate.getMonth() === month
        );
      });

      const monthRevenue = monthBookings
        .filter((booking) => booking.status !== "CANCELLED")
        .reduce((total, booking) => total + booking.totalPrice, 0);

      monthlyData.push({
        month: date.toLocaleString("en-US", {
          month: "short",
        }),
        year,
        bookings: monthBookings.length,
        revenue: monthRevenue,
      });
    }

    // Room performance
    const roomPerformance = rooms.map((room) => {
      const roomBookings = bookings.filter(
        (booking) => booking.roomId === room.id,
      );

      const roomRevenue = roomBookings
        .filter((booking) => booking.status !== "CANCELLED")
        .reduce((total, booking) => total + booking.totalPrice, 0);

      return {
        id: room.id,
        name: room.name,
        price: room.price,
        bookings: roomBookings.length,
        revenue: roomRevenue,
      };
    });

    roomPerformance.sort((a, b) => b.revenue - a.revenue);

    // Rating
    const reviewCount = reviews.length;

    const averageRating =
      reviewCount > 0
        ? reviews.reduce((total, review) => total + review.rating, 0) /
          reviewCount
        : 0;

    res.json({
      status: "success",
      analytics: {
        hotel: {
          id: hotel.id,
          name: hotel.name,
          rating: hotel.rating,
        },

        overview: {
          totalBookings,
          totalRevenue,
          totalGuests: uniqueGuests,
          averageBookingValue,
          occupancyRate,
        },

        bookingStatus,

        monthlyData,

        roomPerformance,

        reviews: {
          count: reviewCount,
          averageRating,
        },
      },
    });
  } catch (error) {
    console.error("Get manager analytics failed:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch analytics",
    });
  }
};

module.exports = {
  getManagerAnalytics,
};
