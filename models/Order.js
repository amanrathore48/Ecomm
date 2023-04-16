const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        id: { type: String },
        title: { type: String },
        img: { type: String },
        brand: { type: String },
        dicount: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        size: { type: String },
        color: { type: String },
      },
    ],
    shippingAddress: {
      id: { type: String },
      name: { type: String },
      phoneNo: { type: Number },
      email: { type: String },
      houseNo: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: Number },
    },
    orderTotal: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    OrderStatus: { type: String, default: "Shipping" },
    isPaid: { type: Boolean },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

mongoose.models = {};

export default mongoose.model.Order || mongoose.model("Order", orderSchema);
