import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/config/db";
import User from "@/models/User";
import { authOptions } from "../../../../auth/[...nextauth]/route";

// PATCH to update user role
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

    // Validate role
    if (!data.role || !["user", "admin"].includes(data.role)) {
      return NextResponse.json(
        { message: "Invalid role specified" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: data.role },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`Error updating role for user ${params.userId}:`, error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
