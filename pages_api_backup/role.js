import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../../../../config/db";
import User from "../../../../../../models/User";

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
    const { role } = req.body;

    // Validate inputs
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!role || !["admin", "user"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Valid role (admin or user) is required" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent changing your own role
    if (user.email === session.user.email) {
      return res
        .status(400)
        .json({ message: "You cannot change your own role" });
    }

    // Update the user's role
    user.role = role;
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
