// This script creates an admin user if one doesn't already exist
// Run it with: node scripts/create-admin.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function createAdmin() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Define User schema
    const UserSchema = new mongoose.Schema(
      {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phoneNo: { type: Number },
        role: {
          type: String,
          enum: ["user", "admin", "editor", "moderator"],
          default: "user",
        },
        orders: [
          {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Order",
          },
        ],
      },
      { timestamps: true }
    );

    // Create User model (if it doesn't already exist)
    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    // Check if admin user already exists
    const adminExists = await User.findOne({
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
    const adminUser = new User({
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
