const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

// Buat booking baru (hanya untuk user yang sudah login)
router.post('/', authMiddleware, bookingController.createBooking);

// Ambil semua booking milik user yang sedang login
router.get('/me', authMiddleware, bookingController.getMyBookings);

// Ambil booking berdasarkan bookingId
router.get('/by-bookingid/:bookingId', authMiddleware, bookingController.getBookingByBookingId);

// Ambil riwayat booking milik user yang sedang login
router.get('/riwayat', authMiddleware, bookingController.getRiwayatBookings);

// Membatalkan booking berdasarkan ID
router.patch('/cancel/:id', authMiddleware, bookingController.cancelBooking);

module.exports = router;