const Obat = require("../models/Obat");

exports.getAll = async (req, res) => {
  try {
    const data = await Obat.find().sort({ nama: 1 });
    res.json(data);
  } catch {
    res.status(500).json({ message: "Gagal mengambil data obat" });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama, deskripsi, dosisUmum, efekSamping, kategori, fotoUrl } = req.body;
    const obat = new Obat({ nama, deskripsi, dosisUmum, efekSamping, kategori, fotoUrl });
    await obat.save();
    res.status(201).json(obat);
  } catch (err) {
    res.status(400).json({ message: "Gagal menambah obat", error: err.message });
  }
};