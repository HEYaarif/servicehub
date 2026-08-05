const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const { getCategories } = require("../controllers/Categorycontroller");

router.get("/", verifyToken, getCategories);

module.exports = router;
