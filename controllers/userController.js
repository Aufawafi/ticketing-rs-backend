const User = require("../models/User");

// Create or update user (POST /api/user)
exports.createOrUpdateUser = async (req, res) => {
  try {
    const { uid, username, email, avatarUrl, phoneNumber } = req.body;
    
    // Cek user yang sudah ada
    const existingUser = await User.findOne({ uid });
    
    // Data update yang akan dikirim
    const updateData = {
      uid,
      email,
      // Prioritaskan data lama jika ada
      username: existingUser?.username || username || email,
      avatarUrl: avatarUrl || existingUser?.avatarUrl || null,
      phoneNumber: phoneNumber || existingUser?.phoneNumber || null,
    };

    // Update atau buat baru dengan upsert
    const user = await User.findOneAndUpdate(
      { uid },
      updateData,
      { 
        new: true, 
        upsert: true,
        // Tambahkan runValidators agar validasi schema dijalankan
        runValidators: true 
      }
    );

    res.json(user);
  } catch (err) {
    console.error('Create/Update User Error:', err);
    res.status(500).json({ 
      message: err.message,
      error: err.toString()
    });
  }
};

// Get current user (GET /api/user/me)
exports.getCurrentUser = async (req, res) => {
  try {
    // Pastikan authMiddleware mengisi req.user.uid
    const uid = req.user?.uid || req.query.uid || req.body.uid;
    if (!uid) return res.status(400).json({ message: "UID tidak ditemukan" });
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user (PUT /api/user)
exports.updateUser = async (req, res) => {
  try {
    const { uid } = req.body;
    
    // Cek user yang sudah ada
    const existingUser = await User.findOne({ uid });
    if (!existingUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Update hanya field yang dikirim
    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.body.phoneNumber) updates.phoneNumber = req.body.phoneNumber;
    if (req.body.avatarUrl !== undefined) updates.avatarUrl = req.body.avatarUrl;

    const user = await User.findOneAndUpdate(
      { uid },
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(user);
  } catch (err) {
    console.error('Update User Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete user (DELETE /api/user)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.uid;
    await User.findOneAndDelete({ uid: userId });
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Gagal menghapus user" });
  }
};

// Update profile (PUT /api/user/profile)
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get profile (GET /api/user/profile)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
