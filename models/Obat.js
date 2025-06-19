const mongoose = require("mongoose");

const ObatSchema = new mongoose.Schema({
  nama: { type: String, required: true, unique: true },
  deskripsi: String,
  dosisUmum: String,
  efekSamping: String,
  kategori: String,
  fotoUrl: String
}, { timestamps: true });

module.exports = mongoose.model("Obat", ObatSchema);