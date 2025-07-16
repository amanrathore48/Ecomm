import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../../../config/db";
import User from "../../../../../models/User";

export default async function handler(req, res) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (session.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    }

    // Only allow PATCH requests
    if (req.method !== "PATCH") {
      res.setHeader("Allow", ["PATCH"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
    }

    // Connect to database
    await connectToDatabase();

    const { userId } = req.query;
    const { name, email } = req.body;

    // Validate inputs
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!name && !email) {
      return res
        .status(400)
        .json({ message: "At least one field to update is required" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's details
    if (name) user.name = name;
    if (email) {
      // Check if email is already in use by another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      user.email = email;
    }

    await user.save();

    // Return the updated user without the password
    const userResponse = user.toObject();
    delete userResponse.password;

    // Add id field for consistency
    userResponse.id = userResponse._id.toString();

    return res.status(200).json(userResponse);
  } catch (error) {
    console.error("API Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
