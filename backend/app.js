const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/user.route");
const adminRoutes = require("./routes/admin.route");
const vendorRoutes = require("./routes/Vendor.route");
const categoriesRoutes = require("./routes/Category.route");
const servicesRoutes = require("./routes/Service.route");
const apiRoutes = require("./routes/Customerbooking.route");
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ServiceHub Backend API is running",});
  });
  
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
