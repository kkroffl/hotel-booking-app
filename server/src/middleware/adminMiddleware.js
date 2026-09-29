const prisma = require("../prisma");

const requireAdmin = async (req, res, next) => {
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

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        status: "error",
        message: "Admin access required",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Admin authorization failed:", error);

    res.status(500).json({
      status: "error",
      message: "Authorization failed",
    });
  }
};

module.exports = requireAdmin;
