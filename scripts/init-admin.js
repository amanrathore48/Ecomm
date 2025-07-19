// This script creates an admin user if one doesn't already exist
// Run it with: node scripts/init-admin.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import User model
const User = require("../models/User");

async function createAdmin() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Check if admin user already exists
    const adminExists = await mongoose.model("User").findOne({
      email: process.env.ADMIN_EMAIL || "admin@ecomm.com",
      role: "admin",
    });

    if (adminExists) {
      console.log("Admin user already exists.");
      return;
    }

    // Create default admin password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "admin123456",
      salt
    );

    // Create admin user
    const adminUser = new mongoose.model("User")({
      name: "Administrator",
      email: process.env.ADMIN_EMAIL || "admin@ecomm.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the function
createAdmin();
