const User = require("../models/user.model");

// GET /api/vendor/profile
exports.getProfile = async (req, res) => {
  try {
    const vendor = req.vendor;
    res.json({
      businessName: vendor.businessName,
      contact: vendor.contact,
      address: vendor.address,
      status: vendor.status,
      rejectionReason: vendor.rejectionReason,
      email: vendor.email,
      name: vendor.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/vendor/profile
exports.updateProfile = async (req, res) => {
  try {
    const { businessName, contact, address } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.vendor._id,
      { businessName, contact, address },
      { new: true }
    ).select("-password -refreshToken");

    res.json({
      businessName: updated.businessName,
      contact: updated.contact,
      address: updated.address,
      status: updated.status,
      rejectionReason: updated.rejectionReason,
      email: updated.email,
      name: updated.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};