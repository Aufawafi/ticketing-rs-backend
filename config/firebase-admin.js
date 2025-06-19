const admin = require("firebase-admin");

try {
  if (!admin.apps.length) {
    let serviceAccount;
    if (process.env.FIREBASE_ADMIN_CONFIG) {
      serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG);
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
    } else {
      // Fallback hanya untuk development lokal
      serviceAccount = require("./serviceAccountKey.json");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully");
  }
} catch (err) {
  console.error("Error initializing Firebase Admin:", err);
  process.exit(1);
}

module.exports = admin;
