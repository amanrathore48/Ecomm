const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    cart: [
      {
        product: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    wishlist: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product" }],
    billingAddresses: [
      {
        label: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        default: { type: Boolean, default: false },
      },
    ],
    shippingAddresses: [
      {
        label: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        default: { type: Boolean, default: false },
      },
    ],
    orders: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Order",
      },
    ],
    phoneNo: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

// Add toJSON transform to convert _id to id for client-side consistency
UserSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  },
});

mongoose.models = {};

export default mongoose.models.User || mongoose.model("User", UserSchema);
