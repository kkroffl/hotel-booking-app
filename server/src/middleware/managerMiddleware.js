const prisma = require("../prisma");

const requireManager = async (req, res, next) => {
  try {
    const userId = Number(req.headers["x-user-id"]);

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role !== "HOTEL_MANAGER") {
      return res.status(403).json({
        status: "error",
        message: "Hotel manager access required",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Manager authorization failed:", error);

    res.status(500).json({
      status: "error",
      message: "Authorization failed",
    });
  }
};

module.exports = requireManager;
