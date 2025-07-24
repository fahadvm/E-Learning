import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { AdminModel } from "../models/Admin"; 
import dotenv from "dotenv";

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI || "");

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
  console.log("Admin created successfully");
  process.exit(0);
}

createAdmin();
