import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/models/Product";

// Cache of recently accessed products to reduce database load
const productCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET(request, { params }) {
  const startTime = Date.now();
  let dbConnected = false;

  try {
    const { productId } = params;
    const cacheKey = `product-${productId}`;

    // Check cache first
    const cachedData = productCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      console.log(`Serving product ${productId} from cache`);

      // Add cache control headers
      return NextResponse.json(
        { success: true, ...cachedData.data, fromCache: true },
        {
          headers: {
            "Cache-Control": "public, max-age=300",
          },
        }
      );
    }

    // Set timeout for database operations
    const timeout = setTimeout(() => {
      if (!dbConnected) {
        console.error(`Database connection timeout for product ${productId}`);
      }
    }, 5000);

    // Connect to database
    await dbConnect();
    dbConnected = true;
    clearTimeout(timeout);

    let product;
    let queryType = "unknown";

    // Check if the productId is a valid ObjectId
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      // If it's a valid ObjectId, search by _id with a timeout
      queryType = "id";
      product = await Promise.race([
        Product.findById(productId).lean().exec(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Query timeout")), 5000)
        ),
      ]);
    } else {
      // Otherwise, try to find by slug with a timeout
      queryType = "slug";
      product = await Promise.race([
        Product.findOne({ slug: productId }).lean().exec(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Query timeout")), 5000)
        ),
      ]);
    }

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
          queryType,
        },
        {
          status: 404,
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
    }

    // Get related products in the same category with timeout
    const relatedProducts = await Promise.race([
      Product.find({
        categories: { $in: product.categories },
        _id: { $ne: product._id },
      })
        .select("name slug price images rating stock") // Only select needed fields
        .lean()
        .limit(4)
        .exec(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Related products query timeout")),
          5000
        )
      ),
    ]);

    const responseData = {
      product,
      relatedProducts,
    };

    // Cache the result
    productCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData,
    });

    // Clean up old cache entries if cache gets too large
    if (productCache.size > 100) {
      const oldestEntries = [...productCache.entries()]
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, 50);

      for (const [key] of oldestEntries) {
        productCache.delete(key);
      }
    }

    // Log performance metrics
    const duration = Date.now() - startTime;
    console.log(`Product ${productId} fetched in ${duration}ms (${queryType})`);

    return NextResponse.json(
      {
        success: true,
        product,
        relatedProducts,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300",
        },
      }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Product detail GET error (${duration}ms):`, error);

    // Different error responses based on error type
    if (
      error.message === "Query timeout" ||
      error.message === "Related products query timeout"
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
        { error: "Failed to fetch product", details: error.message },
        { status: 500 }
      );
    }
  }
}
// Other methods (POST, PUT, DELETE) are handled under /api/admin/products
