import { Suspense } from "react";
import { Filter } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterForm } from "./components/FilterForm";
import { SortForm } from "./components/SortForm";
import { SearchForm } from "./components/SearchForm";
import { Pagination } from "./components/Pagination";
import { ViewToggle } from "./components/ViewToggle";

export const metadata = {
  title: "Shop Products",
  description: "Browse our collection of products",
};

// Helper to get base API URL based on environment
function getBaseApiUrl() {
  // For local development
  return "http://localhost:3000";

  // For production, you would typically use something like:
  // return process.env.NEXT_PUBLIC_API_URL || "https://your-production-domain.com";
}

// This fetches data from our server API
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

  // Debug the params being sent to API
  console.log("API request params:", params.toString());

  try {
    // Use absolute URL (required for server components)
    const baseUrl = `${getBaseApiUrl()}/api/products`;
    const queryString = params.toString();
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    console.log("Products API URL:", url);

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to get category counts from API
async function getCategoryData() {
  try {
    const url = `${getBaseApiUrl()}/api/categories/count`;
    console.log("Categories API URL:", url);

    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error("Failed to fetch category counts");
    }

    const data = await response.json();

    // If the API returns categories, use them
    if (data.categories && data.categories.length > 0) {
      return data.categories;
    }

    // If the API returns no categories, use default list with zero counts
    console.log(
      "No categories returned from API, using defaults with zero counts"
    );
    return [
      { name: "Electronics", count: 0, id: "electronics" },
      { name: "Clothing", count: 0, id: "clothing" },
      { name: "Home & Kitchen", count: 0, id: "home" },
      { name: "Sports & Outdoors", count: 0, id: "sports" },
      { name: "Beauty & Personal Care", count: 0, id: "beauty" },
      { name: "Books", count: 0, id: "books" },
      { name: "Toys & Games", count: 0, id: "toys" },
    ];
  } catch (error) {
    console.error("Error fetching category counts:", error);
    // Return fallback data if API call fails
    return [
      { name: "Electronics", count: 0, id: "electronics" },
      { name: "Clothing", count: 0, id: "clothing" },
      { name: "Home & Kitchen", count: 0, id: "home" },
      { name: "Sports & Outdoors", count: 0, id: "sports" },
      { name: "Beauty & Personal Care", count: 0, id: "beauty" },
      { name: "Books", count: 0, id: "books" },
      { name: "Toys & Games", count: 0, id: "toys" },
    ];
  }
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        console.log("Rendering product:", product._id, product.name);
        // Add a safeguard to ensure product has required fields
        if (!product || !product._id) {
          console.error("Invalid product data:", product);
          return null;
        }
        return <ProductCard key={product._id} product={product} />;
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
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Shop Products</h1>
          <p className="text-muted-foreground">
            {products && products.length > 0 ? (
              <>Showing {products.length} products</>
            ) : (
              <>No products found</>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SearchForm searchParams={searchParams} />
          <ViewToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <Button variant="ghost" size="sm" className="h-8 text-sm" asChild>
                <a href="/products">Clear All</a>
              </Button>
            </div>

            {/* Use the client component for filters */}
            <FilterForm categories={categories} searchParams={searchParams} />
          </div>
        </div>

        {/* Products grid */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <span className="text-sm">Sort By:</span>
            </div>

            {/* Use the client component for sorting */}
            <SortForm searchParams={searchParams} />
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
  );
}
