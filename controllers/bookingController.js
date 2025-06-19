const Booking = require('../models/Booking');
const Dokter = require('../models/Dokter');

function generateBookingCode() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  return (
    "BK" +
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

// Buat helper function untuk error handling
const handleError = (res, err) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message });
};

// Controller untuk mengelola booking
exports.createBooking = async (req, res) => {
  try {
    const { dokterId, rumahSakit, spesialisasi, tanggal, jam } = req.body;

    // Validasi field wajib
    if (!dokterId || !rumahSakit || !spesialisasi || !tanggal || !jam) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    // Validasi format tanggal & jam
    const isValidDate = !isNaN(Date.parse(tanggal));
    const isValidTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(jam);
    if (!isValidDate || !isValidTime) {
      return res.status(400).json({ message: "Format tanggal atau jam tidak valid." });
    }

    // Cek tanggal tidak di masa lalu
    const today = new Date();
    const bookingDate = new Date(tanggal);
    if (bookingDate < today.setHours(0,0,0,0)) {
      return res.status(400).json({ message: "Tanggal booking tidak boleh di masa lalu." });
    }

    // Cek double booking untuk dokter
    const existing = await Booking.findOne({
      dokterId,
      tanggal,
      jam,
      status: { $ne: "Dibatalkan" }
    });
    if (existing) {
      return res.status(409).json({ message: "Slot sudah terisi, silakan pilih jam lain." });
    }

    // Cek double booking untuk user
    const userBooking = await Booking.findOne({
      userId: req.user.uid, // Ganti userId
      tanggal,
      jam,
      status: { $ne: "Dibatalkan" }
    });
    if (userBooking) {
      return res.status(409).json({ message: "Anda sudah booking di jam ini." });
    }

    // Generate booking ID
    const bookingId = generateBookingCode();
    
    // Create new booking
    const booking = new Booking({
      bookingId,
      dokterId, 
      dokter: req.body.dokter || "",
      rumahSakit,
      spesialisasi,
      tanggal,
      jam,
      userId: req.user.uid,
      status: 'Menunggu',
    });

    const savedBooking = await booking.save();

    // untuk send
    res.status(201).json({
      _id: savedBooking._id,
      bookingId: savedBooking.bookingId,
      dokter: savedBooking.dokter,
      dokterId: savedBooking.dokterId,
      rumahSakit: savedBooking.rumahSakit,
      spesialisasi: savedBooking.spesialisasi,
      tanggal: savedBooking.tanggal,
      jam: savedBooking.jam,
      status: savedBooking.status
    });

  } catch (err) {
    handleError(res, err);
  }
};

// Controller untuk mengambil semua booking milik user yang sedang login
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.uid }); // Ganti userId
    // Populate dokter detail
    const bookingsWithDokter = await Promise.all(
      bookings.map(async (b) => {
        const dokter = await Dokter.findById(b.dokterId);
        return {
          ...b.toObject(),
          dokterNama: dokter?.nama || "",
          spesialisasi: dokter?.spesialisasi || "",
          rumahSakit: dokter?.rumahSakit || "",
          jamPeriksa: b.jam,
        };
      })
    );
    res.json(bookingsWithDokter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller untuk mengambil booking berdasarkan bookingId
exports.getBookingByBookingId = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Tiket tidak ditemukan" });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller untuk mengambil riwayat booking
exports.getRiwayatBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.uid,
      status: { $in: ["Selesai", "Dibatalkan"] }
    }).sort({ tanggal: -1, jam: -1 });

    // Populate dokter detail
    const bookingsWithDokter = await Promise.all(
      bookings.map(async (b) => {
        const dokter = await Dokter.findById(b.dokterId);
        return {
          ...b.toObject(),
          dokterNama: dokter?.nama || "",
          spesialisasi: dokter?.spesialisasi || "",
          rumahSakit: dokter?.rumahSakit || b.rumahSakit || "",
          jamPeriksa: b.jam,
        };
      })
    );
    res.json(bookingsWithDokter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller untuk membatalkan booking
exports.cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason?.trim()) {
      return res.status(400).json({ 
        message: "Alasan pembatalan harus diisi" 
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.uid,
      status: { $in: ["Menunggu", "Terverifikasi"] }
    });

    if (!booking) {
      return res.status(404).json({ 
        message: "Booking tidak ditemukan atau tidak bisa dibatalkan" 
      });
    }

    // Ubah status menjadi "Pembatalan Diajukan"
    booking.status = "Pembatalan Diajukan";
    booking.cancelReason = reason;
    await booking.save();

    res.json({ 
      message: "Permintaan pembatalan berhasil diajukan", 
      booking 
    });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ message: err.message });
  }
};