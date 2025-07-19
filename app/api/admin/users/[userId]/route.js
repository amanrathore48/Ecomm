import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/config/db";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET a single user by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { userId } = params;
    const user = await User.findById(userId).select("-password -__v").lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`Error fetching user ${params.userId}:`, error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE a user by ID
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    // Optional: Authentication check (uncomment when confirmed working)
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json(
    //     { message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const { userId } = params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting user ${params.userId}:`, error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH to update user information
export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    // Optional: Authentication check (uncomment when confirmed working)
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json(
    //     { message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const { userId } = params;
    const data = await request.json();

    // Don't allow updating sensitive fields through this endpoint
    const { password, ...updateData } = data;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -__v");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`Error updating user ${params.userId}:`, error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
