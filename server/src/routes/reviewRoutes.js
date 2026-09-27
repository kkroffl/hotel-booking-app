const express = require("express");

const {
  getReviewsByHotel,
  createReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/hotel/:hotelId", getReviewsByHotel);
router.post("/", createReview);

module.exports = router;
