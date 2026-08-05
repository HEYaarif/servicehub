const express = require("express");
const {
  signup,
  login,
  allUser,
  profile,
} = require("../controllers/authControllers.js");
const router = express.Router();
const verifyToken = require("../utils/auth.js");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
