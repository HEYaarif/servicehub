const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const requireRole = require("../middleware/requireRole");
const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require("../controllers/customerBookingController");

router.post("/bookings", verifyToken, requireRole("CUSTOMER"), createBooking);
router.get(
  "/customer/bookings",
  verifyToken,
  requireRole("CUSTOMER"),
  getMyBookings,
);
router.patch(
  "/customer/bookings/:id/cancel",
  verifyToken,
  requireRole("CUSTOMER"),
  cancelBooking,
);

module.exports = router;
