const JurnalObat = require("../models/JurnalObat");

// Get all jurnal obat
exports.getAll = async (req, res) => {
  try {
    const data = await JurnalObat.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data jurnal obat" });
  }
};
 
//create jurnal obat
exports.create = async (req, res) => {
  try {
    const { namaObat, stok, tanggalMasuk, tanggalKeluar, keterangan } = req.body;
    const jurnal = new JurnalObat({ namaObat, stok, tanggalMasuk, tanggalKeluar, keterangan });
    await jurnal.save();
    res.status(201).json(jurnal);
  } catch (err) {
    res.status(400).json({ message: "Gagal menambah jurnal obat" });
  }
};

//delete jurnal obat
exports.delete = async (req, res) => {
  try {
    await JurnalObat.findByIdAndDelete(req.params.id);
    res.json({ message: "Jurnal obat dihapus" });
  } catch (err) {
    res.status(400).json({ message: "Gagal menghapus jurnal obat" });
  }
};