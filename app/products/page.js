import ProductsPageClient from "./components/ProductsPageClient";

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

.mobile-filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-filter-overlay.active {
  opacity: 1;
  visibility: visible;
}

.mobile-filter-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 51;
  max-height: 85vh;
  overflow-y: auto;
}

.dark .mobile-filter-panel {
  background: rgb(31, 41, 55);
}

.mobile-filter-panel.active {
  transform: translateY(0);
}

@media (min-width: 1024px) {
  .mobile-filter-overlay,
  .mobile-filter-panel {
    display: none;
  }
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
    <ProductsPageClient
      products={products}
      totalProducts={totalProducts}
      categories={categories}
      searchParams={searchParams}
      currentPage={currentPage}
      totalPages={totalPages}
      hasActiveFilters={hasActiveFilters}
    />
  );
}
