const mongoose = require("mongoose");

const historyEntrySchema = new mongoose.Schema({
  fromStatus: { type: String, default: null },
  toStatus: { type: String, required: true },
  changedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    offeringId: { type: mongoose.Schema.Types.ObjectId, required: true },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingSlot",
      required: true,
      index: true,
    },
    priceAtBooking: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentMode: {
      type: String,
      enum: ["PAY_NOW", "PAY_AFTER"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "REJECTED",
        "CANCELLED",
        "NO_SHOW",
      ],
      default: "PENDING",
      index: true,
    },
    cancelReason: { type: String, default: null },
    paymentCollected: { type: Boolean, default: false },
    history: [historyEntrySchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
