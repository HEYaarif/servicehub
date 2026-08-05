const express = require("express");
const router = express.Router();

const {
  listServices,
  getServiceById,
  getServiceSlots,
} = require("../controllers/serviceController");

router.get("/", listServices);
router.get("/:id", getServiceById);
router.get("/:id/slots", getServiceSlots);

module.exports = router;
