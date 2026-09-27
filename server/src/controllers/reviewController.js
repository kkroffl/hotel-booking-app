const prisma = require("../prisma");

// Get all reviews for a hotel
const getReviewsByHotel = async (req, res) => {
  try {
    const hotelId = Number(req.params.hotelId);

    const reviews = await prisma.review.findMany({
      where: { hotelId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      status: "success",
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch reviews",
    });
  }
};

// Create a review
const createReview = async (req, res) => {
  try {
    const { userId, hotelId, rating, comment } = req.body;

    if (!userId || !hotelId || !rating || !comment) {
      return res.status(400).json({
        status: "error",
        message: "User, hotel, rating, and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: "error",
        message: "Rating must be between 1 and 5",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const hotel = await prisma.hotel.findUnique({
      where: { id: Number(hotelId) },
    });

    if (!hotel) {
      return res.status(404).json({
        status: "error",
        message: "Hotel not found",
      });
    }

    const completedBooking = await prisma.booking.findFirst({
      where: {
        userId: Number(userId),
        status: "CONFIRMED",
        checkOut: {
          lt: new Date(),
        },
        room: {
          hotelId: Number(hotelId),
        },
      },
    });

    if (!completedBooking) {
      return res.status(403).json({
        status: "error",
        message: "You can only review a hotel after completing a stay",
      });
    }

    const review = await prisma.review.create({
      data: {
        userId: Number(userId),
        hotelId: Number(hotelId),
        rating: Number(rating),
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      status: "success",
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Failed to create review:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to create review",
    });
  }
};

module.exports = {
  getReviewsByHotel,
  createReview,
};
