const mongoose = require("mongoose");
const generateShortId = require('../utils/idGenerator');

const dokterSchema = new mongoose.Schema(
  {
    _id: { 
      type: String,
      default: () => `DR${generateShortId()}` // Format: DR123ABC
    },
    nama: { type: String, required: true },
    spesialisasi: { type: String, required: true },
    rumahSakit: { type: String, required: true },
    foto: { type: String },
    jadwal: { type: Object, default: {} },
    isActive: { type: Boolean, default: true }
  },
  { 
    timestamps: true,
    _id: false // Disable auto ObjectId
  }
);

//validasi untuk memastikan ID unik
dokterSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Check if ID exists
    const exists = await this.constructor.findById(this._id);
    if (exists) {
      // Generate new ID if collision happens
      this._id = `DR${generateShortId()}`;
      return this.pre('save', next);
    }
  }
  next();
});

module.exports = mongoose.model("Dokter", dokterSchema);
