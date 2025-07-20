import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/config/db";
import { Address, User } from "@/models";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    const addressId = params.id;
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return NextResponse.json(
        { error: "Invalid address ID" },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const address = await Address.findOne({
      _id: addressId,
      userId: user._id,
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ address }, { status: 200 });
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { error: "Failed to fetch address" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const addressId = params.id;
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return NextResponse.json(
        { error: "Invalid address ID" },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const addressData = await req.json();

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure the address belongs to the user
    const address = await Address.findOne({
      _id: addressId,
      userId: user._id,
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // If setting as default, unset default for all other addresses
    if (addressData.isDefault) {
      await Address.updateMany(
        { userId: user._id, _id: { $ne: addressId } },
        { $set: { isDefault: false } }
      );
    }

    // Update the address
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      addressData,
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Address updated successfully",
        address: updatedAddress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const addressId = params.id;
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return NextResponse.json(
        { error: "Invalid address ID" },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure the address belongs to the user
    const address = await Address.findOne({
      _id: addressId,
      userId: user._id,
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Delete the address
    await Address.findByIdAndDelete(addressId);

    // Remove the address reference from the user model
    user.addresses = user.addresses.filter(
      (id) => id.toString() !== addressId.toString()
    );
    await user.save();

    return NextResponse.json(
      {
        message: "Address deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
