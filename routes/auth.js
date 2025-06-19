const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-admin');
const User = require('../models/User'); // Pastikan path ini sesuai dengan struktur project Anda

// Endpoint untuk verifikasi token Firebase
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Cari user di database dan kirim role
    const user = await User.findOne({ email: decodedToken.email });
    
    res.json({ 
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: user?.role || 'user' // Tambahkan role
    });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Token tidak valid' });
  }
});

module.exports = router;