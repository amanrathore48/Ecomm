import mongoose from "mongoose";

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

// Check if model already exists to prevent OverwriteModelError during hot reloads
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
