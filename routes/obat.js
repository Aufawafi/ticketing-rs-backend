const express = require("express");
const router = express.Router();
const controller = require("../controllers/obatController");

// Tambahkan authMiddleware jika hanya admin yang boleh tambah
router.get("/", controller.getAll);
router.post("/", controller.create);

module.exports = router;