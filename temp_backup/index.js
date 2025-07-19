import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "../../../../config/db";
import User from "../../../../models/User";

export default async function handler(req, res) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(req, res, authOptions);

    // For debugging - remove this in production
    console.log("Session in users API:", session);

    // Temporarily disabled auth check for debugging
    // if (!session) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

    // if (session?.user?.role !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ message: "Forbidden: Admin access required" });
    // }

    // Connect to database
    await connectToDatabase();

    // Handle GET request - fetch all users
    if (req.method === "GET") {
      try {
        console.log("Fetching users...");
        const users = await User.find({}).select("-password -__v").lean();
        console.log("Users found:", users.length);

        // The toJSON transform in the User model should handle the _id to id conversion

        return res.status(200).json(users);
      } catch (err) {
        console.error("Error in users GET handler:", err);
        return res
          .status(500)
          .json({ message: "Server error fetching users", error: err.message });
      }
    }

    // Handle POST request - create new user
    if (req.method === "POST") {
      const { name, email, password, role } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email and password are required" });
      }

      // Check if user with email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      // Create new user
      const newUser = new User({
        name,
        email,
        password, // The model should handle password hashing
        role: role || "user",
      });
      await newUser.save();

      // Return the user without the password
      const userResponse = newUser.toObject();
      delete userResponse.password;

      // Add id field for consistency
      userResponse.id = userResponse._id.toString();

      return res.status(201).json(userResponse);
    }

    // Handle unsupported methods
    res.setHeader("Allow", ["GET", "POST"]);
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
