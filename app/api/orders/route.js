import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { encryptSensitiveData, decryptSensitiveData } from "@/lib/encryption";
import { decryptPaymentData } from "@/lib/paymentEncryption";

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Check authentication
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse request body
    const requestData = await request.json();
    let { items, shippingInfo, paymentInfo, paymentSummary, amount } =
      requestData;

    // Decrypt sensitive data if needed
    if (paymentInfo) {
      paymentInfo = decryptPaymentData(paymentInfo);
    }

    // Validate the request
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No items in order" },
        { status: 400 }
      );
    }

    // Get the user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Validate products and get latest prices
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, message: "One or more products not found" },
        { status: 400 }
      );
    }

    // Create product map for easy lookup
    const productMap = products.reduce((map, product) => {
      map[product._id.toString()] = product;
      return map;
    }, {});

    // Calculate actual price using current product prices
    const calculatedItems = items.map((item) => {
      const product = productMap[item.productId];
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price, // Use current price from DB
        name: product.name,
        image: item.image || product.images[0],
      };
    });

    // Calculate actual total
    const calculatedAmount = {
      subtotal: calculatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      // Re-calculate the rest using actual prices
    };
    calculatedAmount.tax = calculatedAmount.subtotal * 0.05; // 5% tax
    calculatedAmount.shipping = calculatedAmount.subtotal > 1000 ? 0 : 100;
    calculatedAmount.discount = amount.discount || 0;
    calculatedAmount.total =
      calculatedAmount.subtotal +
      calculatedAmount.tax +
      calculatedAmount.shipping -
      calculatedAmount.discount;

    // Create the order
    const order = new Order({
      user: user._id,
      items: calculatedItems,
      shippingInfo,
      paymentSummary, // Already contains safe payment data
      amount: calculatedAmount,
      status: "processing",
    });

    // If this is a card payment, process payment (just logging for now)
    if (paymentInfo && paymentInfo.paymentMethod === "card") {
      // Process payment here (don't save decrypted info)
      // This is where you'd call a payment processor API
      console.log(
        "Processing payment with decrypted data (masked for security)"
      );

      // Don't log actual card details - just for demo
      console.log(`Payment for order from ${shippingInfo.fullName}`);
    }

    // Save the order
    await order.save();

    // Update user's orders
    user.orders = user.orders || [];
    user.orders.push(order._id);
    await user.save();

    // Return success with order data (will be encrypted by middleware)
    const orderData = {
      _id: order._id,
      status: order.status,
      amount: order.amount,
      createdAt: order.createdAt,
    };

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: orderData,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Connect to database
    await dbConnect();

    // Check authentication
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get the user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Find all orders for the user
    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .select("-paymentInfo"); // Never send encrypted payment info

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
