require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(
  cors({
    origin: ["http://192.168.100.9:3000", "http://localhost:3000"], // atau ganti dengan asal frontend, misal: "http://192.168.100.9:3000"
    credentials: true,
  })
);
app.use(express.json());

// Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// User routes
const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

// Booking routes
const bookingRoutes = require("./routes/booking");
app.use("/api/booking", bookingRoutes);

//Dokter routes
const dokterRoutes = require("./routes/dokter");
app.use("/api/dokter", dokterRoutes);

//emergency routes
const emergencyRoutes = require("./routes/emergency");
app.use("/api/emergency", emergencyRoutes);

// Resep Obat routes
const resepObatRoutes = require("./routes/resepObat");
app.use("/api/resepobat", resepObatRoutes);

// Obat routes
const obatRoutes = require("./routes/obat");
app.use("/api/obat", obatRoutes);

// Admin routes
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API Ticketing Ready!" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));