const express = require("express");
const router = express.Router();
const dokterController = require("../controllers/dokterController");
const Dokter = require("../models/Dokter");

// Endpoint untuk ambil semua dokter
router.get("/", dokterController.getAllDokter);

// Endpoint untuk ambil daftar spesialisasi unik (HARUS DI ATAS /:id)
router.get("/spesialisasi", async (req, res) => {
  try {
    const spesialisasi = await Dokter.distinct("spesialisasi");
    res.json(spesialisasi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint untuk ambil detail dokter by ID
router.get("/:id", dokterController.getDokterById);

module.exports = router;
