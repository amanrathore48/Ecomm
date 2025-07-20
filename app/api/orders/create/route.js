import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Order from "@/models/Order";
import { razorpay } from "@/config/razorpay";

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Verify user authentication
    const session = await getServerSession();

    // Allow checkout in development environment without authentication
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const requestData = await request.json();
    const { amount, currency, items, shippingDetails } = requestData;

    if (!amount || !currency || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
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
        name: shippingDetails.name,
        email: shippingDetails.email,
        phone: shippingDetails.phoneNo,
        address: `${shippingDetails.houseNo}, ${shippingDetails.street}`,
        city: shippingDetails.city,
        state: shippingDetails.state,
        zipCode: shippingDetails.zipCode,
        country: shippingDetails.country,
        addressType: shippingDetails.addressType,
      },
      paymentMethod: shippingDetails.paymentMethod,
      shippingMethod: shippingDetails.shippingMethod,
      subtotal: amount / 100 / 1.18, // Remove GST (18%)
      tax: (amount / 100 / 1.18) * 0.18, // 18% GST
      shippingCost: 49, // Standard shipping cost in INR
      total: amount / 100,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
    });

    await order.save();

    return NextResponse.json({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      currency: currency,
      amount: amount,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
