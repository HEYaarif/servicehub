const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");

const {
  getAllVendors,
  approveVendor,
  rejectVendor,
} = require("../controllers/adminController");

router.get("/vendors", verifyToken, getAllVendors);

router.patch("/vendors/:id/approve", verifyToken, approveVendor);

router.patch("/vendors/:id/reject", verifyToken, rejectVendor);

module.exports = router;
