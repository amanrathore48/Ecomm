const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNo: { type: Number },
    orders: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

mongoose.models = {};

export default mongoose.model.User || mongoose.model("User", UserSchema);
