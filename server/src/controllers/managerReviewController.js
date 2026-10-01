const prisma = require("../prisma");

const getManagerReviews = async (req, res) => {
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

    const reviews = await prisma.review.findMany({
      where: {
        hotelId: hotel.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    const ratingDistribution = {
      5: reviews.filter((review) => review.rating === 5).length,
      4: reviews.filter((review) => review.rating === 4).length,
      3: reviews.filter((review) => review.rating === 3).length,
      2: reviews.filter((review) => review.rating === 2).length,
      1: reviews.filter((review) => review.rating === 1).length,
    };

    res.json({
      status: "success",
      hotel: {
        id: hotel.id,
        name: hotel.name,
      },
      stats: {
        totalReviews,
        averageRating: Number(averageRating.toFixed(1)),
        ratingDistribution,
      },
      reviews,
    });
  } catch (error) {
    console.error("Get manager reviews failed:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch manager reviews",
    });
  }
};

module.exports = {
  getManagerReviews,
};
