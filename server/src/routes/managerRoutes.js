const express = require("express");

const requireManager = require("../middleware/managerMiddleware");
const {
  getManagerHotel,
  getManagerDashboard,
  updateManagerHotel,
} = require("../controllers/managerController");
const router = express.Router();

router.get("/hotel", requireManager, getManagerHotel);
router.get("/dashboard", requireManager, getManagerDashboard);
router.patch("/hotel", requireManager, updateManagerHotel);

module.exports = router;
