const Service = require("../models/Service.model");
exports.getAvailability = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, vendorId: req.vendor._id }).select(
      "availabilityRules dateExceptions"
    );
    if (!service) return res.status(404).json({ message: "Service not found" });

    res.json({
      availabilityRules: service.availabilityRules,
      dateExceptions: service.dateExceptions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { availabilityRules, dateExceptions } = req.body;

    const service = await Service.findOne({ _id: req.params.id, vendorId: req.vendor._id });
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (availabilityRules !== undefined) {
      for (const rule of availabilityRules) {
        if (
          rule.weekday < 0 ||
          rule.weekday > 6 ||
          rule.startMin >= rule.endMin ||
          rule.capacity < 1
        ) {
          return res.status(422).json({ message: "Invalid availability rule" });
        }
      }
      service.availabilityRules = availabilityRules;
    }

    if (dateExceptions !== undefined) {
      service.dateExceptions = dateExceptions;
    }

    await service.save();
    res.json({
      availabilityRules: service.availabilityRules,
      dateExceptions: service.dateExceptions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};