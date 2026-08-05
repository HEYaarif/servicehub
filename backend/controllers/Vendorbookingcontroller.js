const mongoose = require("mongoose");
const Booking = require("../models/booking.model");
const BookingSlot = require("../models/bookingSlot.model");

exports.getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { vendorId: req.vendor._id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("customerId", "name email")
      .populate("serviceId", "title")
      .populate("slotId", "startAt")
      .sort({ createdAt: -1 });

    res.json(
      bookings.map((b) => ({
        _id: b._id,
        customerName: b.customerId?.name,
        serviceTitle: b.serviceId?.title,
        slotStartAt: b.slotId?.startAt,
        status: b.status,
        paymentMode: b.paymentMode,
        priceAtBooking: b.priceAtBooking,
        currency: b.currency,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const LEGAL_TRANSITIONS = {
  PENDING: ["CONFIRMED", "REJECTED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED", "NO_SHOW"],
};

async function transition(req, res, targetStatus) {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, vendorId: req.vendor._id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const allowed = LEGAL_TRANSITIONS[booking.status] || [];
    if (!allowed.includes(targetStatus)) {
      return res.status(422).json({
        message: `Cannot move a ${booking.status} booking to ${targetStatus}`,
      });
    }

    const fromStatus = booking.status;
    booking.status = targetStatus;
    booking.history.push({
      fromStatus,
      toStatus: targetStatus,
      changedById: req.vendor._id,
      reason: req.body?.reason || null,
    });
    if (["REJECTED", "CANCELLED"].includes(targetStatus)) {
      await BookingSlot.findByIdAndUpdate(booking.slotId, { $inc: { bookedCount: -1 } });
    }

    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// PATCH /api/vendor/bookings/:id/confirm
exports.confirmBooking = (req, res) => transition(req, res, "CONFIRMED");

// PATCH /api/vendor/bookings/:id/reject
exports.rejectBooking = (req, res) => transition(req, res, "REJECTED");

// PATCH /api/vendor/bookings/:id/complete
exports.completeBooking = (req, res) => transition(req, res, "COMPLETED");

// PATCH /api/vendor/bookings/:id/no-show
exports.markNoShow = (req, res) => transition(req, res, "NO_SHOW");