const mongoose = require("mongoose");
const User = require("../models/User");
const admin = require("../config/firebase-admin");
require("dotenv").config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    let userRecord;

    try {
      // Try to create new user
      userRecord = await admin.auth().createUser({
        email: "admin@example.com",
        password: "admin123",
      });
      console.log("Firebase user created with UID:", userRecord.uid);
    } catch (firebaseError) {
      if (firebaseError.code === "auth/email-already-exists") {
        // If user exists, get their details
        userRecord = await admin.auth().getUserByEmail("admin@example.com");
        console.log("Found existing Firebase user:", userRecord.uid);
      } else {
        throw firebaseError;
      }
    }

    // Check if user already exists in MongoDB
    let adminUser = await User.findOne({ email: "admin@example.com" });

    if (!adminUser) {
      // Create new user in MongoDB if doesn't exist
      adminUser = await User.create({
        email: "admin@example.com",
        username: "admin",
        uid: userRecord.uid,
        role: "admin",
        permissions: [
          "view_dashboard",
          "manage_users",
          "manage_doctors",
          "manage_bookings",
        ],
      });
      console.log("Admin created successfully in MongoDB:", adminUser);
    } else {
      console.log("Admin already exists in MongoDB:", adminUser);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
