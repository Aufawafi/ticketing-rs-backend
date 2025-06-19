const express = require("express");
const router = express.Router();
const controller = require("../controllers/resepObatController");
const authMiddleware = require("../middleware/authMiddleware");

//untuk mendapatkan semua resep obat
router.get("/", authMiddleware, controller.getByUser);

// untuk membuat resep obat baru
router.post("/", authMiddleware, controller.create);

//untuk delete resep obat
router.delete("/:id", authMiddleware, controller.delete);

module.exports = router;