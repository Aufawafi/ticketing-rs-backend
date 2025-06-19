const express = require("express");
const router = express.Router();
const emergencyController = require("../controllers/emergencyController");

router.get("/", emergencyController.getAllContacts);

module.exports = router;