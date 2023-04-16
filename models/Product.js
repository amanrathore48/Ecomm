const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number },
    sizes: [
      {
        type: String,
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
    categories: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

mongoose.models = {};

export default mongoose.model.Product ||
  mongoose.model("Product", ProductSchema);
