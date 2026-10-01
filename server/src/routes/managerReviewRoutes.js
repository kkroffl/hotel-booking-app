const express = require("express");
const requireManager = require("../middleware/managerMiddleware");

const { getManagerReviews } = require("../controllers/managerReviewController");

const router = express.Router();

router.get("/", requireManager, getManagerReviews);

module.exports = router;
