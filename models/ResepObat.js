const mongoose = require("mongoose");

const resepObatSchema = new mongoose.Schema({
  userId: {
    type: String,  // Ubah dari ObjectId ke String untuk Firebase UID
    required: true,
    ref: 'User'
  },
  obatId: { type: mongoose.Schema.Types.ObjectId, ref: "Obat" },
  namaObat: { type: String, required: true },
  dosis: { type: String, required: true },
  aturanPakai: { type: String },
  tanggal: { type: Date, default: Date.now },
  catatan: { type: String }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("ResepObat", resepObatSchema);