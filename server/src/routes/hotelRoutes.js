const express = require("express");
const { getHotels, getHotelById } = require("../controllers/hotelController");

const router = express.Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);

module.exports = router;
