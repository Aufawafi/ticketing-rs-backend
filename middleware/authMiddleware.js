const User = require("../models/User");
const admin = require("../config/firebase-admin");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    // Cari user di MongoDB berdasarkan uid dari Firebase
    const user = await User.findOne({ uid: decoded.uid });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // Isi req.user dengan data user dari MongoDB (termasuk role)
    req.user = {
      uid: user.uid,
      email: user.email,
      role: user.role,
      _id: user._id,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
