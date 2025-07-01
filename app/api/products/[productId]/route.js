import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/models/Product";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { productId } = params;

    let product;

    // Check if the productId is a valid ObjectId
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      // If it's a valid ObjectId, search by _id
      product = await Product.findById(productId);
    } else {
      // Otherwise, try to find by slug
      product = await Product.findOne({ slug: productId });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get related products in the same category
    const relatedProducts = await Product.find({
      categories: { $in: product.categories },
      _id: { $ne: product._id },
    }).limit(4);

    return NextResponse.json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error("Product detail GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 }
    );
  }
}
// Other methods (POST, PUT, DELETE) are handled under /api/admin/products
