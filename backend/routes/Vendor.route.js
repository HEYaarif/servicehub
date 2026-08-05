const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const requireVendor = require("../middleware/requireVendor");

const serviceController = require("../controllers/Vendorservicecontroller");
const availabilityController = require("../controllers/vendorAvailabilityController");
const bookingController = require("../controllers/vendorBookingController");
const profileController = require("../controllers/vendorProfileController");
const dashboardController = require("../controllers/vendorDashboardController");

router.use(verifyToken, requireVendor);

router.get("/dashboard-stats", dashboardController.getDashboardStats);

router.get("/services", serviceController.getMyServices);
router.post("/services", serviceController.createService);
router.get("/services/:id", serviceController.getMyServiceById);
router.patch("/services/:id", serviceController.updateService);

router.get(
  "/services/:id/availability",
  availabilityController.getAvailability,
);
router.put(
  "/services/:id/availability",
  availabilityController.updateAvailability,
);

router.get("/bookings", bookingController.getMyBookings);
router.patch("/bookings/:id/confirm", bookingController.confirmBooking);
router.patch("/bookings/:id/reject", bookingController.rejectBooking);
router.patch("/bookings/:id/complete", bookingController.completeBooking);
router.patch("/bookings/:id/no-show", bookingController.markNoShow);

router.get("/profile", profileController.getProfile);
router.patch("/profile", profileController.updateProfile);

module.exports = router;
