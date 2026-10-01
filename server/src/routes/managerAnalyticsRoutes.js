const express = require("express");

const requireManager = require("../middleware/managerMiddleware");

const {
  getManagerAnalytics,
} = require("../controllers/managerAnalyticsController");

const router = express.Router();

router.get("/", requireManager, getManagerAnalytics);

module.exports = router;
