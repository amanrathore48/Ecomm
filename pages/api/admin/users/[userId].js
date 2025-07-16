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

    // Connect to database
    await connectToDatabase();

    const { userId } = req.query;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle DELETE request - delete user
    if (req.method === "DELETE") {
      // Prevent deleting yourself
      if (user.email === session.user.email) {
        return res
          .status(400)
          .json({ message: "You cannot delete your own account" });
      }

      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    }

    // Handle GET request - get user details
    if (req.method === "GET") {
      const userResponse = user.toObject();
      delete userResponse.password;
      // Add id field for consistency
      userResponse.id = userResponse._id.toString();
      return res.status(200).json(userResponse);
    }

    // Handle PUT/PATCH request - update user
    if (req.method === "PUT" || req.method === "PATCH") {
      const { name, email, role } = req.body;

      // Update user fields if provided
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;

      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      return res.status(200).json(userResponse);
    }

    // Handle unsupported methods
    res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("API Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
