const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/user.model");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const createAdmin = async () => {
  try {
    const admin = await User.findOne({
      email: "admin@gmail.com",
    });

    if (admin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    });

    console.log("Admin Created Successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

createAdmin();
