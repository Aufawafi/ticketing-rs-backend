const mongoose = require("mongoose");

const JurnalObatSchema = new mongoose.Schema({
  namaObat: { type: String, required: true },
  stok: { type: Number, required: true },
  tanggalMasuk: { type: Date },
  tanggalKeluar: { type: Date },
  keterangan: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("JurnalObat", JurnalObatSchema);