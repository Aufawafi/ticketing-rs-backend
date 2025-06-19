const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      default: () => `BK-${Date.now().toString(36).toUpperCase()}`
    },
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    dokterId: {
      type: String,  // Sesuai dengan format DR123ABC
      required: true,
      ref: 'Dokter'
    },
    dokter: String,         // Backup data dokter
    spesialisasi: String,   // Backup data dokter
    rumahSakit: String,     // Backup data dokter
    tanggal: String,
    jam: String,
    status: {
      type: String,
      enum: ['Menunggu', 'Terverifikasi', 'Selesai', 'Pembatalan Diajukan', 'Dibatalkan'],
      default: 'Menunggu'
    },
    cancelReason: String,
    adminNote: String
  },
  { timestamps: true }
);

// Validasi dan backup data dokter sebelum save
bookingSchema.pre('save', async function(next) {
  if (this.isModified('dokterId')) {
    try {
      const dokter = await mongoose.model('Dokter').findById(this.dokterId);
      if (dokter) {
        this.dokter = dokter.nama;
        this.spesialisasi = dokter.spesialisasi;
        this.rumahSakit = dokter.rumahSakit;
      }
    } catch (err) {
      console.error('Error backing up dokter data:', err);
    }
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
