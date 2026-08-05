const mongoose = require("mongoose");

const offeringSchema = new mongoose.Schema({
  name: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  priceMinorUnits: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  active: { type: Boolean, default: true },
});

const availabilityRuleSchema = new mongoose.Schema({
  weekday: { type: Number, min: 0, max: 6, required: true },
  startMin: { type: Number, required: true },
  endMin: { type: Number, required: true },
  capacity: { type: Number, required: true },
});

const dateExceptionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  isClosed: { type: Boolean, required: true },
  startMin: { type: Number, default: null },
  endMin: { type: Number, default: null },
  capacity: { type: Number, default: null },
});

const serviceSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "SUSPENDED"],
      default: "DRAFT",
    },
    suspendReason: { type: String, default: null },
    offerings: [offeringSchema],
    availabilityRules: [availabilityRuleSchema],
    dateExceptions: [dateExceptionSchema],
  },
  { timestamps: true },
);

serviceSchema.index({ status: 1, categoryId: 1 });

module.exports = mongoose.model("Service", serviceSchema);
