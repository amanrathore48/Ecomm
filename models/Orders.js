const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        prodId: { type: String, required: true },
        prodName: { type: String, required: true },
        prodImg: { type: String, required: true },
        brand: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      phoneNo: { type: Number, required: true },
      email: { type: String },
      houseNo: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: Number, required: true },
    },
    orderDate: { type: Date, default: Date.now },
    orderTotal: { type: Number, required: true },
    OrderStatus: { type: String, default: "Shipping" },
    isPaid: { type: Boolean },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

mongoose.models = {};

export default mongoose.model.Order || mongoose.model("Order", orderSchema);
