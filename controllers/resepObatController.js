const User = require("../models/User");
const ResepObat = require("../models/ResepObat");

// Endpoint untuk membuat resep obat
exports.create = async (req, res) => {
  try {
    const { namaObat, dosis, aturanPakai, catatan } = req.body;
    // Cari user berdasarkan uid dari req.user
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const resep = new ResepObat({
      userId: user._id, // simpan ObjectId user
      namaObat,
      dosis,
      aturanPakai,
      catatan
    });
    await resep.save();
    res.status(201).json(resep);
  } catch (err) {
    res.status(400).json({ message: "Gagal menambah resep obat", error: err.message });
  }
};

// Endpoint untuk mengambil semua resep obat berdasarkan user
exports.getByUser = async (req, res) => {
  try {
    // Cari user berdasarkan uid dari req.user
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    // Ambil semua resep obat yang terkait dengan user berdasarkan userId
    const resep = await ResepObat.find({ userId: user._id }).sort({ tanggal: -1 });
    res.json(resep);
  } catch {
    res.status(500).json({ message: "Gagal mengambil resep obat" });
  }
};
 
//Endpoint untuk delete resep obat
exports.delete = async (req, res) => {
  try {
    // Pastikan hanya user yang punya resep yang bisa hapus
    const resep = await ResepObat.findOneAndDelete({
      _id: req.params.id,
      userId: (await User.findOne({ uid: req.user.uid }))._id
    });
    if (!resep) return res.status(404).json({ message: "Resep tidak ditemukan" });
    res.json({ message: "Resep dihapus" });
  } catch {
    res.status(400).json({ message: "Gagal menghapus resep" });
  }
};