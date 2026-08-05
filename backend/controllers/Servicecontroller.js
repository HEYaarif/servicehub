const mongoose = require("mongoose");
const Service = require("../models/service.model");
const User = require("../models/user.model");
const { generateCandidateSlots, withRemainingCapacity } = require("../utils/slotGenerator");

// GET /api/services?category=&search=&page=&limit=
exports.listServices = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    const filter = { status: "PUBLISHED" };
    if (category) filter.categoryId = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

    // Only services belonging to an ACTIVE vendor are public, even if PUBLISHED.
    const activeVendorIds = await User.find({ role: "VENDOR", status: "ACTIVE" }).distinct("_id");
    filter.vendorId = { $in: activeVendorIds };

    const [services, total] = await Promise.all([
      Service.find(filter)
        .select("title description images categoryId offerings vendorId")
        .populate("categoryId", "name")
        .populate("vendorId", "businessName")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Service.countDocuments(filter),
    ]);

    res.json({
      data: services,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid service id" });
    }

    const service = await Service.findById(req.params.id)
      .populate("categoryId", "name")
      .populate("vendorId", "businessName");

    if (!service || service.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Service not found" });
    }
    if (service.vendorId?.status !== "ACTIVE" && service.vendorId?.role) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceSlots = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid service id" });
    }

    const { offeringId, from, to } = req.query;
    if (!offeringId || !from || !to) {
      return res.status(422).json({ message: "offeringId, from, and to are required" });
    }

    const service = await Service.findById(req.params.id);
    if (!service || service.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Service not found" });
    }

    const offering = service.offerings.id(offeringId);
    if (!offering || !offering.active) {
      return res.status(404).json({ message: "Offering not found" });
    }

    const startDate = new Date(`${from}T00:00:00.000Z`);
    const endDate = new Date(`${to}T00:00:00.000Z`);
    if (endDate < startDate) {
      return res.status(422).json({ message: "'to' must not be before 'from'" });
    }

    const candidates = generateCandidateSlots(service, offering, startDate, endDate);
    const withCapacity = await withRemainingCapacity(service._id, offeringId, candidates);

    res.json(withCapacity.filter((s) => s.remaining > 0));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};