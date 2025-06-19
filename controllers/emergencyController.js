const EmergencyContact = require("../models/EmergencyContact");

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};