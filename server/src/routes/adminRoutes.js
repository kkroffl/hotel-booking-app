const express = require("express");

const requireAdmin = require("../middleware/adminMiddleware");
const { getDashboardStats } = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard", requireAdmin, getDashboardStats);

module.exports = router;
