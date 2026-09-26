const express = require("express");
const { getRooms, getRoomsByHotel } = require("../controllers/roomController");

const router = express.Router();

// GET /api/rooms
// Returns all rooms
router.get("/", getRooms);

// GET /api/rooms/hotel/:hotelId
// Returns all rooms belonging to one hotel
router.get("/hotel/:hotelId", getRoomsByHotel);

module.exports = router;
