import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import User from "@/models/User";
import { encryptSensitiveData } from "@/lib/encryption";

// GET /api/user/profile
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Encrypt sensitive user data before sending response
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      billingDetails: user.billingDetails,
      // Additional user data
    };

    // Encrypt sensitive data in the response
    const encryptedUserData = encryptSensitiveData(userData);

    return NextResponse.json({ success: true, user: encryptedUserData });
  } catch (error) {
    console.error("GET /api/user/profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile
export async function PUT(request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await request.json();

    // Decrypt request data if needed
    const { name, phone, address } = data;

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    // Encrypt sensitive data in the response
    const userData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      // Other user data
    };

    const encryptedUserData = encryptSensitiveData(userData);

    return NextResponse.json({ success: true, user: encryptedUserData });
  } catch (error) {
    console.error("PUT /api/user/profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
