import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters for pagination, sorting, filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const skip = (page - 1) * limit;

    // Handle filtering
    const filter = {};

    // Search filter - check name and description
    if (searchParams.get("search")) {
      filter.$or = [
        { name: { $regex: searchParams.get("search"), $options: "i" } },
        { description: { $regex: searchParams.get("search"), $options: "i" } },
      ];
    }

    // Category filter
    if (searchParams.get("category")) {
      filter.categories = searchParams.get("category");
    }

    // Price range filter
    if (searchParams.get("minPrice") || searchParams.get("maxPrice")) {
      filter.price = {};
      if (searchParams.get("minPrice")) {
        filter.price.$gte = parseFloat(searchParams.get("minPrice"));
      }
      if (searchParams.get("maxPrice")) {
        filter.price.$lte = parseFloat(searchParams.get("maxPrice"));
      }
    }

    // In-stock filter
    if (searchParams.get("inStock") === "true") {
      filter.stock = { $gt: 0 };
    } else if (searchParams.get("inStock") === "false") {
      filter.stock = { $lte: 0 };
    }

    // Rating filter
    if (searchParams.get("minRating")) {
      filter.rating = { $gte: parseFloat(searchParams.get("minRating")) };
    }

    // Execute query
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Debug info
    console.log("API request:");
    console.log("- Filter:", JSON.stringify(filter));
    console.log("- Sort:", JSON.stringify(sort));
    console.log("- Skip:", skip, "Limit:", limit);
    console.log("- Total products found:", total);
    console.log("- Products returned:", products.length);

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
