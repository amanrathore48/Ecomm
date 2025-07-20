import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/config/db";
import { Address, User } from "@/models";

export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ addresses: [] }, { status: 200 });
    }

    await dbConnect();

    // Find the user to get their ID
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ addresses: [] }, { status: 200 });
    }

    // Find all addresses for this user
    const addresses = await Address.find({ userId: user._id });

    return NextResponse.json(
      { addresses: Array.isArray(addresses) ? addresses : [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ addresses: [] }, { status: 200 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const addressData = await req.json();

    await dbConnect();

    // Find the user to get their ID
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If this is marked as default, unset default flag on all other addresses
    if (addressData.isDefault) {
      await Address.updateMany(
        { userId: user._id },
        { $set: { isDefault: false } }
      );
    }

    // Create the new address
    const newAddress = new Address({
      ...addressData,
      userId: user._id,
    });

    await newAddress.save();

    // Add the address reference to the user model
    user.addresses.push(newAddress._id);
    await user.save();

    return NextResponse.json(
      {
        message: "Address created successfully",
        address: newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}
