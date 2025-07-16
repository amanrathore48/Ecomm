import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/models/Product";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { productId } = params;

    let product;

    // First, try to find the product by ID (if it's a valid MongoDB ObjectId)
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(productId);
    }

    // If not found by ID or not a valid ObjectId, try by slug
    if (!product) {
      product = await Product.findOne({ slug: productId });
    }

    // If still not found, return 404
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Admin product detail GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 }
    );
  }
}

// Update a product by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { productId } = params;
    const data = await request.json();

    // Find the product first (by ID or slug)
    let product;

    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(productId);
    }

    if (!product) {
      product = await Product.findOne({ slug: productId });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update the product
    Object.keys(data).forEach((key) => {
      product[key] = data[key];
    });

    const updated = await product.save();

    return NextResponse.json({
      success: true,
      product: updated,
    });
  } catch (error) {
    console.error("Admin product update PUT error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }

      return NextResponse.json(
        {
          error: "Validation failed",
          validationErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

// Delete a product by ID
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { productId } = params;

    let product;

    // Try to find the product by ID first
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findByIdAndDelete(productId);
    } else {
      // If not a valid ObjectId, find by slug and then delete
      product = await Product.findOneAndDelete({ slug: productId });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Admin product DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}
