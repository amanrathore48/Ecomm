import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();

    // Use MongoDB aggregation to count products by category
    const categoryCounts = await Product.aggregate([
      // Unwind categories array to have one document per category
      { $unwind: "$categories" },

      // Group by category and count
      {
        $group: {
          _id: "$categories",
          count: { $sum: 1 },
        },
      },

      // Sort by count in descending order
      { $sort: { count: -1 } },

      // Format the output
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: { $toUpper: { $substr: ["$_id", 0, 1] } }, // Capitalize first letter
          count: 1,
        },
      },
    ]);

    // Process each category to format its name properly
    const formattedCategories = categoryCounts.map((cat) => {
      // Format name properly (capitalize first letter, lowercase rest)
      const name = cat.id.charAt(0).toUpperCase() + cat.id.slice(1);

      return {
        id: cat.id,
        name: name,
        count: cat.count,
      };
    });

    return NextResponse.json({
      success: true,
      categories: formattedCategories,
    });
  } catch (error) {
    console.error("Category count error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category counts", details: error.message },
      { status: 500 }
    );
  }
}
