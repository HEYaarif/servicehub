const mongoose = require("mongoose");

const bookingSlotSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },
    offeringId: { type: mongoose.Schema.Types.ObjectId, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    capacity: { type: Number, required: true },
    bookedCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

bookingSlotSchema.index({ offeringId: 1, startAt: 1 }, { unique: true });

module.exports = mongoose.model("BookingSlot", bookingSlotSchema);
