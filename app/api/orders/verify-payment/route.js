import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Order from "@/models/Order";
import crypto from "crypto";

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request data
    const requestData = await request.json();
    const {
      paymentId,
      orderId: razorpayOrderId,
      signature,
      orderDbId,
    } = requestData;

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest("hex");

    // If the signature doesn't match, payment is not valid
    if (generatedSignature !== signature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Find the order in our database
    const order = await Order.findById(orderDbId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.paymentStatus === "completed") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
      });
    }

    // Update order status
    order.paymentStatus = "completed";
    order.paymentId = paymentId;
    order.status = "processing";
    order.paymentVerified = true;
    order.updatedAt = new Date();

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      order: {
        id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying payment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
