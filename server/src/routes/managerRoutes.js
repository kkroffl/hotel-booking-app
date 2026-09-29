const express = require("express");

const requireManager = require("../middleware/managerMiddleware");
const {
  getManagerHotel,
  getManagerDashboard,
} = require("../controllers/managerController");
const router = express.Router();

router.get("/hotel", requireManager, getManagerHotel);
router.get("/dashboard", requireManager, getManagerDashboard);

module.exports = router;
