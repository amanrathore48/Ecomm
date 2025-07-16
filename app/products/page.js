import { Suspense } from "react";
import { Filter } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterForm } from "./components/FilterForm";
import { SortForm } from "./components/SortForm";
import { Pagination } from "./components/Pagination";
import { ViewToggle } from "./components/ViewToggle";
import { FilterButton } from "./components/FilterButton";

export const metadata = {
  title: "Shop Products",
  description: "Browse our collection of products",
};

// Add CSS for animations
const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// Helper to get base API URL based on environment
function getBaseApiUrl() {
  // Determine the environment-specific base URL
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // For production environment
  return (
    process.env.NEXT_PUBLIC_API_URL || "https://ecomm-eight-pearl.vercel.app"
  );
}

// This fetches data from our server API with improved error handling and retries
async function getProducts(searchParams) {
  const params = new URLSearchParams();

  // Copy all relevant search parameters to the API request
  if (searchParams.category) {
    params.append("category", searchParams.category);
  }

  if (searchParams.minPrice) {
    params.append("minPrice", searchParams.minPrice);
  }

  if (searchParams.maxPrice) {
    params.append("maxPrice", searchParams.maxPrice);
  }

  if (searchParams.inStock) {
    params.append("inStock", searchParams.inStock);
  }

  if (searchParams.rating) {
    params.append("minRating", searchParams.rating);
  }

  if (searchParams.search) {
    params.append("search", searchParams.search);
  }

  // Handle pagination
  const page = parseInt(searchParams.page) || 1;
  params.append("page", page);
  params.append("limit", "12");

  // Handle sorting
  if (searchParams.sort && searchParams.sort !== "featured") {
    let sortField;
    let sortOrder;

    switch (searchParams.sort) {
      case "newest":
        sortField = "createdAt";
        sortOrder = "desc";
        break;
      case "price-low":
        sortField = "price";
        sortOrder = "asc";
        break;
      case "price-high":
        sortField = "price";
        sortOrder = "desc";
        break;
      case "best-rated":
        sortField = "rating";
        sortOrder = "desc";
        break;
      default:
        // Don't add any sort parameters for "featured" or unknown values
        break;
    }

    if (sortField && sortOrder) {
      params.append("sortBy", sortField);
      params.append("sortOrder", sortOrder);
    }
  }

  console.log("API request params:", params.toString());

  // Maximum number of retry attempts
  const MAX_RETRIES = 2;
  let retries = 0;

  // Use timeout and retry logic for improved reliability
  const fetchWithRetry = async () => {
    try {
      // Use absolute URL (required for server components)
      const baseUrl = `${getBaseApiUrl()}/api/products`;
      const queryString = params.toString();
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

      console.log(
        `Products API URL (attempt ${retries + 1}/${MAX_RETRIES + 1}):`,
        url
      );

      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch(url, {
        next: { revalidate: 60 }, // Cache for 60 seconds
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      // Clear timeout since the request completed
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error(`Error fetching products (attempt ${retries + 1}):`, error);

      // Handle specific error types
      if (error.name === "AbortError") {
        console.log("Request timed out");
      } else if (
        error.message.includes("NetworkError") ||
        error.message.includes("fetch")
      ) {
        console.log("Network error");
      }

      // Retry logic
      if (retries < MAX_RETRIES) {
        retries++;
        // Exponential backoff for retries
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Retrying in ${delay}ms...`);

        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry();
      }

      console.error(
        `All ${MAX_RETRIES + 1} attempts failed. Returning empty array.`
      );
      return [];
    }
  };

  return fetchWithRetry();
}

// Function to get category counts from API with improved error handling and retries
async function getCategoryData() {
  // Default categories in case the API fails
  const defaultCategories = [
    { name: "Electronics", count: 0, id: "electronics" },
    { name: "Clothing", count: 0, id: "clothing" },
    { name: "Home & Kitchen", count: 0, id: "home" },
    { name: "Sports & Outdoors", count: 0, id: "sports" },
    { name: "Beauty & Personal Care", count: 0, id: "beauty" },
  ];

  // Maximum number of retry attempts
  const MAX_RETRIES = 2;
  let retries = 0;

  const fetchWithRetry = async () => {
    try {
      const url = `${getBaseApiUrl()}/api/categories/count`;
      console.log(
        `Categories API URL (attempt ${retries + 1}/${MAX_RETRIES + 1}):`,
        url
      );

      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(url, {
        next: { revalidate: 300 }, // Cache for 5 minutes since categories change less frequently
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      // Clear timeout since the request completed
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // If the API returns categories, use them
      if (data.categories && data.categories.length > 0) {
        return data.categories;
      }

      console.log(
        "No categories returned from API, using defaults with zero counts"
      );
      return defaultCategories;
    } catch (error) {
      console.error(
        `Error fetching categories (attempt ${retries + 1}):`,
        error
      );

      // Retry logic for specific errors
      if (
        (error.name === "AbortError" ||
          error.message.includes("NetworkError") ||
          error.message.includes("fetch")) &&
        retries < MAX_RETRIES
      ) {
        retries++;
        // Exponential backoff for retries
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Retrying category fetch in ${delay}ms...`);

        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry();
      }

      console.error(
        "Failed to fetch categories after all attempts, using defaults"
      );
      return defaultCategories;
    }
  };

  return fetchWithRetry();
}

// Loading component for products
function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="bg-card border rounded-lg overflow-hidden">
            <div className="h-60 bg-secondary/20 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-secondary/40 rounded animate-pulse"></div>
              <div className="h-4 bg-secondary/40 rounded w-1/2 animate-pulse"></div>
              <div className="h-8 bg-secondary/40 rounded animate-pulse mt-4"></div>
            </div>
          </div>
        ))}
    </div>
  );
}

// Products list component
function ProductsList({ products }) {
  // Debug - log products to server console
  console.log(
    "ProductsList rendering - products:",
    products ? products.length : 0
  );
  if (products && products.length > 0) {
    console.log("First product in list:", products[0]);
  }

  if (!products || products.length === 0) {
    console.log("No products found, showing empty state");
    return (
      <EmptyState
        icon="🔍"
        title="No products found"
        description="Try adjusting your filters or search terms"
        action={
          <Button asChild>
            <a href="/products">Clear All Filters</a>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => {
        // Add a safeguard to ensure product has required fields
        if (!product || !product._id) {
          console.error("Invalid product data:", product);
          return null;
        }

        // Add staggered animation with different delays
        const animationDelay = `${(index % 5) * 0.05}s`;

        return (
          <div
            key={product._id}
            className="transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg"
            style={{
              animationDelay,
              animation: `fadeInUp 0.5s ease-out ${animationDelay} forwards`,
              opacity: 0,
            }}
          >
            <ProductCard product={product} />
          </div>
        );
      })}
    </div>
  );
}

// Get the total count of products for accurate pagination
async function getProductsCount(searchParams) {
  try {
    const params = new URLSearchParams();

    if (searchParams.category) {
      params.append("category", searchParams.category);
    }

    if (searchParams.search) {
      params.append("search", searchParams.search);
    }

    // Add other filters as needed
    if (searchParams.minPrice) {
      params.append("minPrice", searchParams.minPrice);
    }

    if (searchParams.maxPrice) {
      params.append("maxPrice", searchParams.maxPrice);
    }

    if (searchParams.inStock) {
      params.append("inStock", searchParams.inStock);
    }

    // Use absolute URL (required for server components)
    const baseUrl = `${getBaseApiUrl()}/api/products`;
    const queryString = params.toString();
    const url = queryString
      ? `${baseUrl}?${queryString}&limit=1&page=1`
      : `${baseUrl}?limit=1&page=1`;

    console.log("Count API URL:", url);

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product count");
    }

    const data = await response.json();
    return data.pagination?.total || 0;
  } catch (error) {
    console.error("Error fetching product count:", error);
    return 0;
  }
}

export default async function ProductsPage({ searchParams }) {
  // Fetch products using the server component
  const products = await getProducts(searchParams || {});
  const totalProducts = await getProductsCount(searchParams || {});

  // Fetch real category counts
  const categories = await getCategoryData();

  // Add animation styles to the page
  const pageStyles = styles;

  // Debug - log products to server console
  console.log("Products fetched:", products && products.length);
  if (products && products.length > 0) {
    console.log("First product:", products[0]._id, products[0].name);
  }
  console.log("Categories fetched:", categories.length);

  // Calculate values for pagination
  const currentPage = parseInt(searchParams?.page || "1");
  const itemsPerPage = 12; // Should match the limit in the API call
  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      <div className="container mx-auto px-4 py-16">
        {/* Modern Hero Section for Products */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl mb-10 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Browse Our Collection
              </h1>
              <p className="text-muted-foreground text-lg">
                {products && products.length > 0 ? (
                  <>
                    Showing {products.length} of {totalProducts} products
                  </>
                ) : (
                  <>No products match your criteria</>
                )}
                {searchParams?.search && (
                  <>
                    {" "}
                    for "
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {searchParams.search}
                    </span>
                    "
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ViewToggle />
              <FilterButton />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar filters */}
          <div
            id="filters-section"
            className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 lg:self-start"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-xl text-gray-900 dark:text-white flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Filters
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-sm hover:bg-blue-50 dark:hover:bg-gray-700"
                  asChild
                >
                  <a href="/products">Clear All</a>
                </Button>
              </div>

              {/* Use the client component for filters */}
              <FilterForm categories={categories} searchParams={searchParams} />
            </div>
          </div>

          {/* Products grid */}
          <div className="lg:col-span-3">
            {/* Sorting */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-3">
              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300 mr-2">
                  {totalProducts} products found
                </span>
                {searchParams?.search && (
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Search: {searchParams.search}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sort by:
                </span>
                <SortForm searchParams={searchParams} />
              </div>
            </div>

            <Suspense fallback={<ProductsLoading />}>
              <ProductsList products={products} />
            </Suspense>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              {/* Use the client component for pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                searchParams={searchParams}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
