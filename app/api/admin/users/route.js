import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/config/db";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    // Connect to database
    await dbConnect();

    // Optional: Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    console.log("Session in App Router users API:", session);

    // NOTE: Authentication check is temporarily disabled for debugging
    // Uncomment once confirmed working
    // if (!session) {
    //   return NextResponse.json(
    //     { message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    // if (session?.user?.role !== "admin") {
    //   return NextResponse.json(
    //     { message: "Forbidden: Admin access required" },
    //     { status: 403 }
    //   );
    // }

    // Fetch all users
    console.log("Fetching users from database...");
    const users = await User.find({}).select("-password -__v").lean();
    console.log("Users found:", users.length);

    // Return the users
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in App Router users API:", error);
    return NextResponse.json(
      { message: "Server error fetching users", error: error.message },
      { status: 500 }
    );
  }
}

// POST to create a new user
export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Parse the request body
    const data = await request.json();
    const { name, email, password, role } = data;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create the new user
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // Return the created user without password
    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    return NextResponse.json(userToReturn, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Server error creating user", error: error.message },
      { status: 500 }
    );
  }
}
