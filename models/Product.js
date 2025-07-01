import mongoose from "mongoose";
import slugify from "slugify";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    desc: { type: String, required: true },
    description: { type: String, required: true },
    mainImage: { type: String, required: true },
    images: [{ type: String }],
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    categories: [{ type: String }],
    tags: [{ type: String }],
    specifications: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: String },
        rating: { type: Number },
        title: { type: String },
        content: { type: String },
        date: { type: Date, default: Date.now },
        helpful: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

// Ensure slug remains unique
ProductSchema.pre("validate", function (next) {
  // If slug is not provided, generate it from name
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

mongoose.models = {};

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
