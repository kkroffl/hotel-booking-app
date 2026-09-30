const express = require("express");

const requireManager = require("../middleware/managerMiddleware");
const {
  getManagerHotel,
  getManagerDashboard,
  updateManagerHotel,
  createManagerHotel,
} = require("../controllers/managerController");
const router = express.Router();

router.get("/hotel", requireManager, getManagerHotel);
router.get("/dashboard", requireManager, getManagerDashboard);
router.patch("/hotel", requireManager, updateManagerHotel);
router.post("/hotel", requireManager, createManagerHotel);

module.exports = router;
