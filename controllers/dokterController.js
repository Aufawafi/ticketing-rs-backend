const Dokter = require('../models/Dokter');

// Ambil semua dokter
exports.getAllDokter = async (req, res) => {
  try {
    const dokters = await Dokter.find();
    res.json(dokters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil detail dokter by ID
exports.getDokterById = async (req, res) => {
  try {
    const dokter = await Dokter.findById(req.params.id);
    if (!dokter) return res.status(404).json({ message: "Dokter tidak ditemukan" });
    res.json(dokter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};