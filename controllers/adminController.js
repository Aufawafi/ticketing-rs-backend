const User = require("../models/User");
const Dokter = require("../models/Dokter"); // Update import name
const Booking = require("../models/Booking");

// Stats Controller
exports.getStats = async (req, res) => {
  try {
    const [users, doctors, bookings] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Dokter.countDocuments(), // Update model name
      Booking.find(),
    ]);

    const stats = {
      totalUsers: users,
      totalDoctors: doctors,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === "Menunggu").length,
    };

    res.json(stats);
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Gagal memuat statistik" });
  }
};

// Bookings Controller
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("dokterId", "nama spesialisasi"); // Ganti doctorId -> dokterId, name -> nama, specialization -> spesialisasi

    res.json(bookings);
  } catch (error) {
    console.error("Bookings Error:", error);
    res.status(500).json({ message: "Gagal memuat data booking" });
  }
};

// Doctors Controller
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Dokter.find(); // Update model name
    res.json(doctors);
  } catch (error) {
    console.error("Doctors Error:", error);
    res.status(500).json({ message: "Gagal memuat data dokter" });
  }
};

// Users Controller
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Users Error:", error);
    res.status(500).json({ message: "Gagal memuat data user" });
  }
};

// Update schema fields sesuai model Dokter.js
exports.createDoctor = async (req, res) => {
  try {
    const doctor = new Dokter({
      // ID akan di-generate otomatis oleh schema
      nama: req.body.nama,
      spesialisasi: req.body.spesialisasi,
      rumahSakit: req.body.rumahSakit,
      foto: req.body.foto,
      jadwal: req.body.jadwal || {},
    });

    const savedDoctor = await doctor.save();
    // ID akan terlihat seperti: DR123ABC
    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah dokter" });
  }
};
