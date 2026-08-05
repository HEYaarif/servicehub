const Service = require("../models/Service.model");
const Booking = require("../models/Booking.model");

// GET /api/vendor/dashboard-stats
exports.getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [activeServices, pendingBookings, bookingsToday] = await Promise.all([
      Service.countDocuments({ vendorId, status: "PUBLISHED" }),
      Booking.countDocuments({ vendorId, status: "PENDING" }),
      Booking.countDocuments({ vendorId, createdAt: { $gte: startOfDay, $lte: endOfDay } }),
    ]);

    res.json({ activeServices, pendingBookings, bookingsToday });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};