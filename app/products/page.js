import { Suspense } from "react";
import {
  Filter,
  Search,
  Grid,
  List,
  Sparkles,
  TrendingUp,
  Star,
  Tag,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { FilterForm } from "./components/FilterForm";
import { SortForm } from "./components/SortForm";
import { Pagination } from "./components/Pagination";
import { ViewToggle } from "./components/ViewToggle";
import { FilterButton } from "./components/FilterButton";

export const metadata = {
  title: "Shop Products",
  description: "Browse our collection of products",
};

// Enhanced CSS animations with modern effects
const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 0px, #e0e0e0 40px, #f0f0f0 80px);
  background-size: 200px;
  animation: shimmer 1.5s infinite ease-out;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .glass-effect {
  background: rgba(31, 41, 55, 0.9);
  border: 1px solid rgba(75, 85, 99, 0.2);
}

.gradient-border {
  position: relative;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4);
  border-radius: 12px;
  padding: 1px;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 1px;
  background: white;
  border-radius: 11px;
  z-index: -1;
}

.floating-element {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
`;

// Helper to get base API URL based on environment
function getBaseApiUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return (
    process.env.NEXT_PUBLIC_API_URL || "https://ecomm-eight-pearl.vercel.app"
  );
}

// Enhanced products fetching with better error handling
async function getProducts(searchParams) {
  const params = new URLSearchParams();

  if (searchParams.category) {
    if (Array.isArray(searchParams.category)) {
      searchParams.category.forEach((cat) => {
        params.append("category", cat);
      });
    } else {
      params.append("category", searchParams.category);
    }
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

  const page = parseInt(searchParams.page) || 1;
  params.append("page", page);
  params.append("limit", "12");

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
        break;
    }

    if (sortField && sortOrder) {
      params.append("sortBy", sortField);
      params.append("sortOrder", sortOrder);
    }
  }

  console.log("API request params:", params.toString());

  const MAX_RETRIES = 2;
  let retries = 0;

  const fetchWithRetry = async () => {
    try {
      const baseUrl = `${getBaseApiUrl()}/api/products`;
      const queryString = params.toString();
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

      console.log(
        `Products API URL (attempt ${retries + 1}/${MAX_RETRIES + 1}):`,
        url
      );

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        next: { revalidate: 0 },
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error(`Error fetching products (attempt ${retries + 1}):`, error);

      if (error.name === "AbortError") {
        console.log("Request timed out");
      } else if (
        error.message.includes("NetworkError") ||
        error.message.includes("fetch")
      ) {
        console.log("Network error");
      }

      if (retries < MAX_RETRIES) {
        retries++;
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

// Enhanced category data fetching
async function getCategoryData() {
  const defaultCategories = [
    { name: "Electronics", count: 0, id: "electronics" },
    { name: "Clothing", count: 0, id: "clothing" },
    { name: "Home & Kitchen", count: 0, id: "home" },
    { name: "Sports & Outdoors", count: 0, id: "sports" },
    { name: "Beauty & Personal Care", count: 0, id: "beauty" },
  ];

  const MAX_RETRIES = 2;
  let retries = 0;

  const fetchWithRetry = async () => {
    try {
      const url = `${getBaseApiUrl()}/api/categories/count`;
      console.log(
        `Categories API URL (attempt ${retries + 1}/${MAX_RETRIES + 1}):`,
        url
      );

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        next: { revalidate: 300 },
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

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

      if (
        (error.name === "AbortError" ||
          error.message.includes("NetworkError") ||
          error.message.includes("fetch")) &&
        retries < MAX_RETRIES
      ) {
        retries++;
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

// Enhanced loading component with skeleton effects
function ProductsLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-6 w-48 shimmer rounded"></div>
            <div className="h-4 w-32 shimmer rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-20 shimmer rounded-lg"></div>
            <div className="h-10 w-20 shimmer rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 border rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="aspect-square shimmer"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 shimmer rounded"></div>
                <div className="h-4 w-2/3 shimmer rounded"></div>
                <div className="flex items-center justify-between">
                  <div className="h-6 w-16 shimmer rounded"></div>
                  <div className="h-8 w-20 shimmer rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// Enhanced products list component
function ProductsList({ products }) {
  const productCount = products ? products.length : 0;

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Try adjusting your filters or search terms to find what you're
            looking for.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline">
              <a href="/products">Clear Filters</a>
            </Button>
            <Button asChild>
              <a href="/">Browse All</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => {
        if (!product || !product._id) {
          console.error("Invalid product data:", product);
          return null;
        }

        const animationDelay = `${(index % 8) * 0.1}s`;

        let productToRender = { ...product };

        if (
          !productToRender.mainImage &&
          productToRender.images &&
          productToRender.images.length > 0
        ) {
          productToRender.mainImage = productToRender.images[0];
        }

        if (!productToRender.slug) {
          console.warn(`Product missing slug field: ${productToRender._id}`);
        }

        return (
          <div
            key={product._id}
            className="group transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
            style={{
              animationDelay,
              animation: `fadeInUp 0.6s ease-out ${animationDelay} forwards`,
              opacity: 0,
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              <ProductCard product={productToRender} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Enhanced product count fetching
async function getProductsCount(searchParams) {
  try {
    const params = new URLSearchParams();

    if (searchParams.category) {
      params.append("category", searchParams.category);
    }

    if (searchParams.search) {
      params.append("search", searchParams.search);
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
  const products = await getProducts(searchParams || {});
  const totalProducts = await getProductsCount(searchParams || {});
  const categories = await getCategoryData();

  const currentPage = parseInt(searchParams?.page || "1");
  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage));

  // Determine if filters are active
  const hasActiveFilters = Boolean(
    searchParams?.category ||
      searchParams?.minPrice ||
      searchParams?.maxPrice ||
      searchParams?.search ||
      searchParams?.rating ||
      searchParams?.inStock
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          {/* Enhanced Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl sm:rounded-3xl mb-8 sm:mb-12 shadow-xl sm:shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 floating-element"></div>
            <div
              className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32 floating-element"
              style={{ animationDelay: "2s" }}
            ></div>

            <div className="relative p-4 sm:p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured Collection
                    </Badge>
                    {hasActiveFilters && (
                      <Badge className="bg-green-500/20 text-white border-green-400/30">
                        <Filter className="w-3 h-3 mr-1" />
                        Filtered Results
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 leading-tight">
                    Discover Amazing Products
                  </h1>

                  <div className="text-white/90 text-base sm:text-lg lg:text-xl mb-4 sm:mb-6">
                    {products && products.length > 0 ? (
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          {products.length} of {totalProducts} products
                        </span>
                        {searchParams?.search && (
                          <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                            <Search className="w-4 h-4" />"{searchParams.search}
                            "
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        No products match your criteria
                      </span>
                    )}
                  </div>

                  {searchParams?.category && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm">
                        Category: {searchParams.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:gap-4 mt-4 sm:mt-0">
                  <div className="glass-effect rounded-xl sm:rounded-2xl p-2 sm:p-4">
                    <ViewToggle />
                  </div>
                  <div className="glass-effect rounded-xl sm:rounded-2xl p-2 sm:p-4">
                    <FilterButton />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-8">
            {/* Enhanced Sidebar */}
            <div className="xl:col-span-1">
              <div className="sticky top-20 sm:top-24 space-y-4 sm:space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 border-b border-gray-100 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        Filters
                      </h2>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs sm:text-sm hover:bg-blue-100 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400"
                          asChild
                        >
                          <a href="/products">Reset</a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <FilterForm
                      categories={categories}
                      searchParams={searchParams}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Shop Stats
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Total Products
                      </span>
                      <Badge variant="secondary">{totalProducts}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Categories
                      </span>
                      <Badge variant="secondary">{categories.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Current Page
                      </span>
                      <Badge variant="secondary">
                        {currentPage} / {totalPages}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="xl:col-span-4">
              {/* Enhanced Sorting Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-4 sm:mb-8 overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          {totalProducts} Products
                        </span>
                      </div>

                      {searchParams?.search && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs sm:text-sm">
                          <Search className="w-3 h-3 mr-1" />
                          {searchParams.search}
                        </Badge>
                      )}

                      {searchParams?.category && (
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs sm:text-sm">
                          <Tag className="w-3 h-3 mr-1" />
                          {searchParams.category}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 mt-2 lg:mt-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                        Sort by:
                      </span>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl p-1">
                        <SortForm searchParams={searchParams} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <Suspense fallback={<ProductsLoading />}>
                <ProductsList products={products} />
              </Suspense>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 sm:mt-16">
                  <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-8">
                    <div className="text-center mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                        Page {currentPage} of {totalPages}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
                        {totalProducts} products
                      </p>
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      searchParams={searchParams}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
