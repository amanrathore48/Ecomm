import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/models/Product";

// Simple in-memory cache with TTL
const queryCache = new Map();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes in milliseconds

export async function GET(request) {
  const startTime = Date.now();
  let dbConnected = false;

  try {
    // Get query parameters for pagination, sorting, filtering
    const { searchParams } = new URL(request.url);

    // Create a cache key from the query parameters
    const cacheKey = [...searchParams.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => `${k}=${v}`)
      .join("&");

    // Check cache first
    const cachedData = queryCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      console.log(`Serving products from cache for query: ${cacheKey}`);
      return NextResponse.json(
        { success: true, ...cachedData.data, fromCache: true },
        {
          headers: {
            "Cache-Control": "public, max-age=120", // 2 minutes
          },
        }
      );
    }

    // Set timeout for database connection
    const connectionTimeout = setTimeout(() => {
      if (!dbConnected) {
        console.error(`Database connection timeout for product listing`);
      }
    }, 5000);

    // Connect to database
    await dbConnect();
    dbConnected = true;
    clearTimeout(connectionTimeout);

    // Parse query parameters
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
      const searchTerm = searchParams.get("search");
      // Use text index if available, otherwise fall back to regex
      if (searchTerm.length > 3) {
        filter.$or = [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ];
      } else {
        filter.name = { $regex: `^${searchTerm}`, $options: "i" }; // Starts with for short terms
      }
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

    // Execute queries with timeouts
    const [total, products] = await Promise.all([
      Promise.race([
        Product.countDocuments(filter).exec(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Count query timeout")), 5000)
        ),
      ]),
      Promise.race([
        Product.find(filter)
          .select("name slug price images rating stock categories") // Only select needed fields
          .lean() // Return plain objects instead of Mongoose documents
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Find query timeout")), 5000)
        ),
      ]),
    ]);

    // Prepare response data
    const responseData = {
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };

    // Cache the result
    queryCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData,
    });

    // Clean up old cache entries if cache gets too large
    if (queryCache.size > 50) {
      const oldestEntries = [...queryCache.entries()]
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, 20);

      for (const [key] of oldestEntries) {
        queryCache.delete(key);
      }
    }

    // Log performance and query info
    const duration = Date.now() - startTime;
    console.log(`Product listing fetched in ${duration}ms`);
    console.log(`- Filter: ${JSON.stringify(filter)}`);
    console.log(`- Sort: ${JSON.stringify(sort)}`);
    console.log(`- Pagination: page ${page}, limit ${limit}, skip ${skip}`);
    console.log(`- Results: ${products.length} of ${total} total`);

    return NextResponse.json(
      {
        success: true,
        products,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
      {
        headers: {
          "Cache-Control": "public, max-age=120", // 2 minutes
        },
      }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Product listing GET error (${duration}ms):`, error);

    // Determine appropriate error response based on error type
    if (
      error.message === "Count query timeout" ||
      error.message === "Find query timeout"
    ) {
      return NextResponse.json(
        {
          error: "Database query timed out. Please try again.",
          details: error.message,
        },
        { status: 503 } // Service Unavailable
      );
    } else if (
      error.name === "MongoNetworkError" ||
      error.message.includes("ETIMEOUT")
    ) {
      return NextResponse.json(
        {
          error: "Database connection issue. Please try again later.",
          details: error.message,
        },
        { status: 503 } // Service Unavailable
      );
    } else {
      return NextResponse.json(
        { error: "Failed to fetch products", details: error.message },
        { status: 500 }
      );
    }
  }
}
