const express = require("express");

const {
  getBookings,
  getBookingsByUser,
  createBooking,
  cancelBooking,
} = require("../controllers/bookingController");

const router = express.Router();

// GET /api/bookings
// Returns all bookings
router.get("/", getBookings);

// GET /api/bookings/user/:userId
// Returns bookings belonging to one user
router.get("/user/:userId", getBookingsByUser);

// POST /api/bookings
// Creates a new booking
router.post("/", createBooking);

// PATCH /api/bookings/:id/cancel
// Cancels an existing booking
router.patch("/:id/cancel", cancelBooking);

module.exports = router;
