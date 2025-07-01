import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters for pagination, sorting, filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const sort = searchParams.get("sort") || "-createdAt"; // Default sort by newest

    const skip = (page - 1) * limit;

    // Handle filtering
    const filter = {};
    if (searchParams.get("search")) {
      filter.$or = [
        { name: { $regex: searchParams.get("search"), $options: "i" } },
        { description: { $regex: searchParams.get("search"), $options: "i" } },
      ];
    }

    if (searchParams.get("category")) {
      filter.categories = searchParams.get("category");
    }

    // Execute query
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Validate required fields before saving
    const requiredFields = [
      "name",
      "slug",
      "desc",
      "description",
      "price",
      "mainImage",
      "brand",
      "stock",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    // Validate array fields
    const validationErrors = {};
    if (missingFields.length > 0) {
      missingFields.forEach((field) => {
        validationErrors[field] = "This field is required";
      });
    }

    // Check sizes, categories, tags
    if (!data.sizes || !Array.isArray(data.sizes) || data.sizes.length === 0) {
      validationErrors.sizes = "At least one size is required";
    }

    if (
      !data.categories ||
      !Array.isArray(data.categories) ||
      data.categories.length === 0
    ) {
      validationErrors.categories = "At least one category is required";
    }

    if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
      validationErrors.tags = "At least one tag is required";
    }

    // Check if price is valid
    if (data.price !== undefined) {
      const price = Number(data.price);
      if (isNaN(price) || price <= 0) {
        validationErrors.price = "Price must be a positive number";
      }
    }

    // Check if stock is valid
    if (data.stock !== undefined) {
      const stock = Number(data.stock);
      if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
        validationErrors.stock = "Stock must be a non-negative integer";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          error: `Validation failed: ${Object.keys(validationErrors).join(
            ", "
          )}`,
          validationErrors,
        },
        { status: 400 }
      );
    }

    // Create the product
    const product = await Product.create(data);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product POST error:", error);

    // Handle MongoDB duplicate key errors (e.g., duplicate slug)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          error: `A product with this ${duplicateField} already exists. Please use a different value.`,
          field: duplicateField,
        },
        { status: 400 }
      );
    }

    // Handle Mongoose validation errors
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
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Remove id from the data to prevent accidental overwrite
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("Product PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}
