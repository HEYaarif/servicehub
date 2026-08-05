const Service = require("../models/Service.model");

// GET /api/vendor/services
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ vendorId: req.vendor._id }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/vendor/services/:id
exports.getMyServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, vendorId: req.vendor._id });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/vendor/services
exports.createService = async (req, res) => {
  try {
    const { title, description, categoryId, offerings } = req.body;

    if (!title || !description || !categoryId) {
      return res.status(422).json({ message: "title, description, and categoryId are required" });
    }

    const service = await Service.create({
      vendorId: req.vendor._id,
      title,
      description,
      categoryId,
      offerings: offerings || [],
      status: "DRAFT",
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/vendor/services/:id
exports.updateService = async (req, res) => {
  try {
    const { title, description, categoryId, offerings, status } = req.body;

    const service = await Service.findOne({ _id: req.params.id, vendorId: req.vendor._id });
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (title !== undefined) service.title = title;
    if (description !== undefined) service.description = description;
    if (categoryId !== undefined) service.categoryId = categoryId;
    if (offerings !== undefined) service.offerings = offerings;
    
    if (status !== undefined) {
      if (service.status === "SUSPENDED") {
        return res.status(403).json({ message: "A suspended service can only be reinstated by an admin" });
      }
      if (!["DRAFT", "PUBLISHED"].includes(status)) {
        return res.status(422).json({ message: "Vendors may only set status to DRAFT or PUBLISHED" });
      }
      service.status = status;
    }

    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};