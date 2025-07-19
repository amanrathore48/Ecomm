import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import { razorpay } from "@/config/razorpay";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Connect to database
    await connectDB();

    const {
      paymentId,
      orderId: razorpayOrderId,
      signature,
      orderDbId,
    } = req.body;

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest("hex");

    // If the signature doesn't match, payment is not valid
    if (generatedSignature !== signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Find the order in our database
    const order = await Order.findById(orderDbId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "completed") {
      return res.status(200).json({ message: "Payment already verified" });
    }

    // Update order status
    order.paymentStatus = "completed";
    order.paymentId = paymentId;
    order.status = "processing";
    order.paymentVerified = true;
    order.updatedAt = new Date();

    await order.save();

    return res.status(200).json({
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
    return res.status(500).json({
      message: "Error verifying payment",
      error: error.message,
    });
  }
}
