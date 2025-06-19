module.exports.isAdmin = (req, res, next) => {
  // Pastikan req.user sudah diisi oleh authMiddleware
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Akses ditolak. Anda tidak memiliki izin admin." });
};