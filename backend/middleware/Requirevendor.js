const User = require("../models/user.model");
async function requireVendor(req, res, next) {
  const userId = req.user?.id || req.user?._id || req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ message: "User no longer exists" });
  }

  if (user.role !== "VENDOR") {
    return res.status(403).json({ message: "Vendor access only" });
  }

  if (user.status !== "ACTIVE") {
    return res.status(403).json({ message: `Vendor account is ${user.status.toLowerCase()}` });
  }

  req.vendor = user;
  next();
}

module.exports = requireVendor;