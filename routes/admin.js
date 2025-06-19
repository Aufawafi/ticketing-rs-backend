const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Obat = require("../models/Obat");
const ResepObat = require("../models/ResepObat");
const Dokter = require("../models/Dokter");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const admin = require("../config/firebase-admin"); // Update import

router.use(authMiddleware, isAdmin);

// Statistik
router.get("/stats", async (req, res) => {
  try {
    const totalUser = await User.countDocuments();
    const totalObat = await Obat.countDocuments();
    const totalResep = await ResepObat.countDocuments();
    const totalDokter = await Dokter.countDocuments();
    const totalBooking = await Booking.countDocuments();
    res.json({ totalUser, totalObat, totalResep, totalDokter, totalBooking });
  } catch {
    res.status(500).json({ message: "Gagal mengambil data statistik" });
  }
});

// User Management Routes
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle user role
router.put("/users/:uid/role", async (req, res) => {
  try {
    const { uid } = req.params;
    const { isAdmin } = req.body;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Update role
    user.role = isAdmin ? "admin" : "user";
    await user.save();

    res.json(user);
  } catch (err) {
    console.error("Toggle role error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE User dengan better error handling
router.delete("/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    // 1. Cek user di MongoDB
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan di database",
      });
    }

    // 2. Hapus dari Firebase Auth
    try {
      await admin.auth().deleteUser(uid);
      console.log("User berhasil dihapus dari Firebase");
    } catch (firebaseErr) {
      if (firebaseErr.code === "auth/user-not-found") {
        console.log(
          "User tidak ditemukan di Firebase, melanjutkan hapus dari MongoDB"
        );
      } else {
        console.error("Firebase delete error:", firebaseErr);
      }
    }

    // 3. Hapus semua data terkait secara berurutan
    try {
      // Hapus resep obat
      await ResepObat.deleteMany({ userId: uid });
      console.log("Resep obat berhasil dihapus");

      // Hapus booking
      await Booking.deleteMany({ userId: uid });
      console.log("Booking berhasil dihapus");

      // Hapus user dari MongoDB
      await User.findOneAndDelete({ uid });
      console.log("User berhasil dihapus dari MongoDB");

      res.json({
        success: true,
        message: "User dan semua data terkait berhasil dihapus",
      });
    } catch (dbErr) {
      console.error("Database delete error:", dbErr);
      res.status(500).json({
        message: "Gagal menghapus data dari database",
        error: dbErr.message,
      });
    }
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({
      message: "Gagal menghapus user",
      error: err.message,
    });
  }
});

// Obat
router.get("/obat", async (req, res) => {
  const obat = await Obat.find().sort({ nama: 1 });
  res.json(obat);
});

// Dokter
router.get("/doctors", async (req, res) => {
  const dokter = await Dokter.find().sort({ nama: 1 });
  res.json(dokter);
});

// Booking Routes
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    // Populate email user dan data dokter
    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        try {
          // Get user email
          const user = await User.findOne({ uid: booking.userId });

          // Get dokter data
          const dokter = await Dokter.findById(booking.dokterId);

          return {
            ...booking.toObject(),
            userEmail: user?.email || "-",
            dokter: dokter?.nama || booking.dokter || "-",
            spesialisasi: dokter?.spesialisasi || booking.spesialisasi || "-",
            rumahSakit: dokter?.rumahSakit || booking.rumahSakit || "-",
          };
        } catch (err) {
          console.error(`Error populating booking ${booking._id}:`, err);
          return booking.toObject();
        }
      })
    );

    res.json(populatedBookings);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update Booking Status
router.put("/bookings/:id/status", async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNote,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    res.json(booking);
  } catch (err) {
    console.error("Update booking status error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Resep
router.get("/resep", async (req, res) => {
  try {
    // Ambil semua resep
    const resep = await ResepObat.find().sort({ createdAt: -1 });

    // Ambil semua userId unik dari resep
    const userIds = [...new Set(resep.map((r) => r.userId))];

    // Ambil data user berdasarkan _id
    const users = await User.find({ _id: { $in: userIds } });

    // Buat map _id -> email
    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = user.email;
    });

    // Gabungkan data resep
    const resepWithEmail = resep.map((r) => ({
      _id: r._id,
      namaObat: r.namaObat,
      dosis: r.dosis,
      aturanPakai: r.aturanPakai,
      catatan: r.catatan,
      createdAt: r.createdAt,
      userEmail: userMap[r.userId] || "-", // Ambil email dari map
    }));

    res.json(resepWithEmail);
  } catch (err) {
    console.error("Error fetching resep:", err);
    res.status(500).json({ message: "Gagal mengambil data resep" });
  }
});

// CREATE Obat
router.post("/obat", async (req, res) => {
  try {
    const { nama, deskripsi, dosisUmum, efekSamping } = req.body;
    const obat = new Obat({ nama, deskripsi, dosisUmum, efekSamping });
    await obat.save();
    res.status(201).json(obat);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal menambah obat", error: err.message });
  }
});

// UPDATE Obat
router.put("/obat/:id", async (req, res) => {
  try {
    const { nama, deskripsi, dosisUmum, efekSamping } = req.body;
    const obat = await Obat.findByIdAndUpdate(
      req.params.id,
      { nama, deskripsi, dosisUmum, efekSamping },
      { new: true }
    );
    res.json(obat);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal mengedit obat", error: err.message });
  }
});

// DELETE Obat
router.delete("/obat/:id", async (req, res) => {
  try {
    await Obat.findByIdAndDelete(req.params.id);
    res.json({ message: "Obat berhasil dihapus" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal menghapus obat", error: err.message });
  }
});

// CREATE Dokter
router.post("/doctors", async (req, res) => {
  try {
    const { _id, nama, spesialisasi, rumahSakit, foto, jadwal } = req.body;
    // Jika _id diisi, gunakan sebagai dokterId, jika tidak, MongoDB akan generate otomatis
    const dokter = new Dokter({
      _id,
      nama,
      spesialisasi,
      rumahSakit,
      foto,
      jadwal,
    });
    await dokter.save();
    res.status(201).json(dokter);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal menambah dokter", error: err.message });
  }
});

// UPDATE Dokter
router.put("/doctors/:id", async (req, res) => {
  try {
    const { nama, spesialisasi, rumahSakit, foto, jadwal } = req.body;
    const dokter = await Dokter.findByIdAndUpdate(
      req.params.id,
      { nama, spesialisasi, rumahSakit, foto, jadwal },
      { new: true }
    );
    res.json(dokter);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal mengedit dokter", error: err.message });
  }
});

// DELETE Dokter
router.delete("/doctors/:id", async (req, res) => {
  try {
    await Dokter.findByIdAndDelete(req.params.id);
    res.json({ message: "Dokter berhasil dihapus" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal menghapus dokter", error: err.message });
  }
});

// DELETE Booking
router.delete("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }
    res.json({ message: "Booking berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
