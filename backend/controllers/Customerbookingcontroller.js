const Service = require("../models/service.model");
const BookingSlot = require("../models/bookingSlot.model");
const Booking = require("../models/booking.model");
const { generateCandidateSlots } = require("../utils/slotGenerator");
async function claimSlot({ serviceId, offeringId, startAt, endAt, capacity }) {
  try {
    return await BookingSlot.create({ serviceId, offeringId, startAt, endAt, capacity, bookedCount: 1 });
  } catch (err) {
    if (err.code !== 11000) throw err;

    return BookingSlot.findOneAndUpdate(
      { offeringId, startAt, $expr: { $lt: ["$bookedCount", "$capacity"] } },
      { $inc: { bookedCount: 1 } },
      { new: true }
    );
  }
}

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, offeringId, startAt, paymentMode } = req.body;

    if (!serviceId || !offeringId || !startAt || !paymentMode) {
      return res.status(422).json({ message: "serviceId, offeringId, startAt, and paymentMode are required" });
    }
    if (!["PAY_NOW", "PAY_AFTER"].includes(paymentMode)) {
      return res.status(422).json({ message: "paymentMode must be PAY_NOW or PAY_AFTER" });
    }

    const service = await Service.findById(serviceId);
    if (!service || service.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Service not found" });
    }

    const offering = service.offerings.id(offeringId);
    if (!offering || !offering.active) {
      return res.status(404).json({ message: "Offering not found" });
    }

    const requestedStart = new Date(startAt);
    if (isNaN(requestedStart.getTime()) || requestedStart <= new Date()) {
      return res.status(422).json({ message: "Cannot book a slot that has already passed" });
    }
    const dayStart = new Date(requestedStart);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    const candidates = generateCandidateSlots(service, offering, dayStart, dayEnd);
    const match = candidates.find((c) => c.startAt.getTime() === requestedStart.getTime());

    if (!match) {
      return res.status(422).json({ message: "That is not a bookable slot for this offering" });
    }

    const slot = await claimSlot({
      serviceId: service._id,
      offeringId,
      startAt: match.startAt,
      endAt: match.endAt,
      capacity: match.capacity,
    });

    if (!slot) {
      return res.status(409).json({ message: "This slot just filled up — pick another time" });
    }

    try {
      const booking = await Booking.create({
        customerId: req.user.id || req.user._id,
        vendorId: service.vendorId,
        serviceId: service._id,
        offeringId,
        slotId: slot._id,
        priceAtBooking: offering.priceMinorUnits,
        currency: offering.currency,
        paymentMode,
        status: "PENDING",
        history: [{ toStatus: "PENDING", changedById: req.user.id || req.user._id }],
      });

      res.status(201).json(booking);
    } catch (bookingError) {
      await BookingSlot.findByIdAndUpdate(slot._id, { $inc: { bookedCount: -1 } });
      throw bookingError;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/customer/bookings?status=
exports.getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { customerId: req.user.id || req.user._id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("serviceId", "title")
      .populate("vendorId", "businessName")
      .populate("slotId", "startAt")
      .sort({ createdAt: -1 });

    res.json(
      bookings.map((b) => ({
        _id: b._id,
        serviceTitle: b.serviceId?.title,
        vendorName: b.vendorId?.businessName,
        slotStartAt: b.slotId?.startAt,
        status: b.status,
        paymentMode: b.paymentMode,
        priceAtBooking: b.priceAtBooking,
        currency: b.currency,
        createdAt: b.createdAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customerId: req.user.id || req.user._id,
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
      return res.status(422).json({ message: `Cannot cancel a ${booking.status} booking` });
    }

    booking.status = "CANCELLED";
    booking.cancelReason = req.body?.reason || "Cancelled by customer";
    booking.history.push({
      fromStatus: booking.status,
      toStatus: "CANCELLED",
      changedById: req.user.id || req.user._id,
      reason: booking.cancelReason,
    });
    await booking.save();

    await BookingSlot.findByIdAndUpdate(booking.slotId, { $inc: { bookedCount: -1 } });

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};