const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { AdminModel } = require("../models/Admin"); 



async function createAdmin() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/devnext');

    const existing = await AdminModel.findOne({ email: "admin@devnext.com" });
    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new AdminModel({
      email: "admin@devnext.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
