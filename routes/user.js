const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User"); // Pastikan model User diimport

// Tambah user baru atau update jika sudah ada
router.post("/", async (req, res) => {
  try {
    const { uid, username, email } = req.body;
    
    // Cek user sudah ada
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      // Update user yang ada
      existingUser.username = username;
      existingUser.email = email;
      await existingUser.save();
      return res.json(existingUser);
    }

    // Buat user baru
    const user = new User({
      uid,
      username,
      email,
      isAdmin: email === "admin@example.com", // Set admin default
      avatarUrl: null,
      phoneNumber: ""
    });

    await user.save();
    res.status(201).json(user);

  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ 
      message: "Gagal membuat user",
      error: err.message 
    });
  }
});

// Ambil data user saat ini
router.get("/me", authMiddleware, userController.getCurrentUser);

// Update data user
router.put("/", authMiddleware, userController.updateUser);

// Delete user account - Fix: Pass the controller function
router.delete("/", authMiddleware, userController.deleteUser);

module.exports = router;