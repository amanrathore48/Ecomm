import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import { razorpay } from "@/config/razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Connect to database
    await connectDB();

    // Verify user authentication
    const session = await getServerSession(req, res, authOptions);

    // Allow checkout in development environment without authentication
    if (!session && process.env.NODE_ENV !== "development") {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { amount, currency, items, shippingDetails } = req.body;

    if (!amount || !currency || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Create Razorpay order
    const razorpayOrderOptions = {
      amount: Math.round(amount), // amount in smallest currency unit (paise)
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(razorpayOrderOptions);

    // Create order in our database
    const order = new Order({
      user: session?.user?.id || "guest",
      items: items.map((item) => ({
        product: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingAddress: {
        firstName: shippingDetails.firstName,
        lastName: shippingDetails.lastName,
        address: shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state,
        zipCode: shippingDetails.zipCode,
        country: shippingDetails.country,
        phone: shippingDetails.phone,
        email: shippingDetails.email,
      },
      paymentMethod: shippingDetails.paymentMethod,
      shippingMethod: shippingDetails.shippingMethod,
      subtotal: (amount / 100) * 0.92, // Remove tax (8%)
      tax: (amount / 100) * 0.08,
      shippingCost: 5.99, // Standard shipping cost
      total: amount / 100,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
    });

    await order.save();

    return res.status(200).json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      currency: currency,
      amount: amount,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
}
