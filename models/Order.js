const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: false, // Allow guest checkout
    },
    items: [
      {
        product: { type: String }, // Product ID
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        image: { type: String },
        size: { type: String },
        color: { type: String },
      },
    ],
    shippingAddress: {
      firstName: { type: String },
      lastName: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    subtotal: { type: Number },
    tax: { type: Number },
    shippingCost: { type: Number },
    total: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    },
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", "failed", "refunded"],
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "razorpay"],
    },
    shippingMethod: { type: String, enum: ["standard", "express"] },
    razorpayOrderId: { type: String },
    paymentId: { type: String },
    paymentVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

mongoose.models = {};

export default mongoose.model.Order || mongoose.model("Order", orderSchema);
