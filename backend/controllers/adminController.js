const User = require("../models/user.model");

exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({
      role: "VENDOR",
    }).select("-password -refreshToken");

    res.json(vendors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.approveVendor = async (req, res) => {
  try {
    const vendor = await User.findByIdAndUpdate(
      req.params.id,

      {
        status: "ACTIVE",
      },

      {
        new: true,
      },
    );

    res.json({
      success: true,

      message: "Vendor Approved",

      vendor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.rejectVendor = async (req, res) => {
  try {
    const vendor = await User.findByIdAndUpdate(
      req.params.id,

      {
        status: "REJECTED",
      },

      {
        new: true,
      },
    );

    res.json({
      success: true,

      message: "Vendor Rejected",

      vendor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
