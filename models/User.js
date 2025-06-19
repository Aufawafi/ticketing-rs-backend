const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: { 
      type: String, 
      required: [true, 'Firebase UID diperlukan'], 
      unique: true 
    },
    username: { 
      type: String, 
      required: [true, 'Username diperlukan'],
      trim: true,
      minlength: [3, 'Username minimal 3 karakter']
    },
    email: { 
      type: String, 
      required: [true, 'Email diperlukan'],
      unique: true,
      lowercase: true,
      trim: true
    },
    avatarUrl: { 
      type: String,
      default: null
    },
    phoneNumber: { 
      type: String,
      default: null,
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    permissions: [{
      type: String,
      enum: [
        'view_dashboard',    // Lihat overview
        'manage_users',      // CRUD users
        'manage_doctors',    // CRUD doctors
        'manage_bookings'    // Manage bookings
      ]
    }],
    lastLogin: Date,
    deviceId: String
  }, 
  { 
    timestamps: true,
    // Tambahkan toJSON untuk mengatur output JSON
    toJSON: {
      transform: function(doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Index untuk pencarian
userSchema.index({ email: 1, username: 1 });

module.exports = mongoose.model("User", userSchema);
