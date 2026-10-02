const express = require("express");

const {
  getHotels,
  getFeaturedHotels,
  getHotelById,
} = require("../controllers/hotelController");

const router = express.Router();

router.get("/", getHotels);

router.get("/featured", getFeaturedHotels);

router.get("/:id", getHotelById);

module.exports = router;
