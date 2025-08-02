"use client";
import {
  Filter,
  Search,
  Grid,
  List,
  Sparkles,
  TrendingUp,
  Star,
  Tag,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { FilterForm } from "./FilterForm";
import { SortForm } from "./SortForm";
import { Pagination } from "./Pagination";
import { ViewToggle } from "./ViewToggle";
import { Suspense, useState } from "react";
import { ProductCard } from "@/components/product-card";

// Enhanced loading component with skeleton effects
function ProductsLoading() {
  return (
    <div className="space-y-4 xxs:space-y-6 xs:space-y-8">
      {/* Header skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl xxs:rounded-2xl p-3 xxs:p-4 xs:p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 xxs:h-5 xs:h-6 w-32 xxs:w-40 xs:w-48 shimmer rounded"></div>
            <div className="h-3 xxs:h-4 w-24 xxs:w-28 xs:w-32 shimmer rounded"></div>
          </div>
          <div className="flex gap-1 xxs:gap-2">
            <div className="h-8 xxs:h-9 xs:h-10 w-16 xxs:w-18 xs:w-20 shimmer rounded-lg"></div>
            <div className="h-8 xxs:h-9 xs:h-10 w-16 xxs:w-18 xs:w-20 shimmer rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 xxs:gap-3 xs:gap-4 sm:gap-6">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 border rounded-xl xxs:rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="aspect-square shimmer"></div>
              <div className="p-2 xxs:p-3 xs:p-4 space-y-2 xxs:space-y-3">
                <div className="h-4 xxs:h-5 shimmer rounded"></div>
                <div className="h-3 xxs:h-4 w-2/3 shimmer rounded"></div>
                <div className="flex items-center justify-between">
                  <div className="h-5 xxs:h-6 w-12 xxs:w-14 xs:w-16 shimmer rounded"></div>
                  <div className="h-6 xxs:h-7 xs:h-8 w-16 xxs:w-18 xs:w-20 shimmer rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// Mobile Filter Component
function MobileFilterModal({ isOpen, onClose, children, hasActiveFilters }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className={`mobile-filter-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>
      <div className={`mobile-filter-panel ${isOpen ? "active" : ""}`}>
        <div className="p-4 xxs:p-5 xs:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 xxs:mb-6">
            <div className="flex items-center gap-2 xxs:gap-3">
              <div className="w-8 h-8 xxs:w-9 xxs:h-9 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 xxs:w-5 xxs:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg xxs:text-xl font-bold text-gray-900 dark:text-white">
                Filters
              </h2>
              {hasActiveFilters && (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                  Active
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 xxs:w-9 xxs:h-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4 xxs:w-5 xxs:h-5" />
            </Button>
          </div>

          {/* Filter Content */}
          <div className="max-h-[60vh] overflow-y-auto">{children}</div>

          {/* Actions */}
          <div className="flex gap-2 xxs:gap-3 pt-4 xxs:pt-6 border-t border-gray-200 dark:border-gray-700 mt-4 xxs:mt-6">
            {hasActiveFilters && (
              <Button
                variant="outline"
                className="flex-1 rounded-xl text-sm xxs:text-base"
                asChild
              >
                <a href="/products">Clear All</a>
              </Button>
            )}
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm xxs:text-base"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Enhanced products list component
function ProductsList({ products, viewType = "grid" }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 xxs:py-16">
        <div className=" mx-auto px-4">
          <div className="w-20 h-20 xxs:w-24 xxs:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 xxs:mb-6">
            <Search className="w-10 h-10 xxs:w-12 xxs:h-12 text-blue-600" />
          </div>
          <h3 className="text-xl xxs:text-2xl font-bold text-gray-900 dark:text-white mb-3 xxs:mb-4">
            No products found
          </h3>
          <p className="text-sm xxs:text-base text-gray-600 dark:text-gray-400 mb-6 xxs:mb-8">
            Try adjusting your filters or search terms to find what you're
            looking for.
          </p>
          <div className="flex flex-col xxs:flex-row gap-2 xxs:gap-3 justify-center">
            <Button asChild variant="outline" className="text-sm xxs:text-base">
              <a href="/products">Clear Filters</a>
            </Button>
            <Button asChild className="text-sm xxs:text-base">
              <a href="/">Browse All</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        viewType === "grid"
          ? "grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 xxs:gap-3 xs:gap-4 sm:gap-6"
          : "flex flex-col gap-2 xxs:gap-3 xs:gap-4"
      }
    >
      {products.map((product, index) => {
        if (!product || !product._id) {
          console.error("Invalid product data:", product);
          return null;
        }

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
          <ProductCard
            key={productToRender._id}
            product={productToRender}
            variant={viewType === "grid" ? "compact" : "list"}
          />
        );
      })}
    </div>
  );
}

// Client component for mobile filter functionality
export default function ProductsPageClient({
  products,
  totalProducts,
  categories,
  searchParams,
  currentPage,
  totalPages,
  hasActiveFilters,
}) {
  const [viewType, setViewType] = useState("grid"); // grid or list
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="w-full max-w-screen-2xl mx-auto px-2 xxs:px-3 xs:px-4 sm:px-6 py-2 xxs:py-4 xs:py-6 sm:py-8">
          {/* Combined Hero and Sorting Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-xl mb-4 sm:mb-6 shadow-lg">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium text-sm sm:text-base">
                        {totalProducts} Products
                      </span>
                    </div>

                    {hasActiveFilters && (
                      <Badge className="bg-green-500/20 text-white border-green-400/30 text-xs">
                        <Filter className="w-3 h-3 mr-1" />
                        <span>Filtered</span>
                      </Badge>
                    )}

                    {searchParams?.search && (
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">
                        <Search className="w-3 h-3 mr-1" />
                        <span className="max-w-[100px] truncate">
                          {searchParams.search}
                        </span>
                      </Badge>
                    )}

                    {searchParams?.category && (
                      <Badge className="bg-purple-500/20 text-white border-purple-400/30 text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        <span className="max-w-[100px] truncate">
                          {searchParams.category}
                        </span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/80">Sort by:</span>
                      <div className="glass-effect rounded-lg p-1">
                        <SortForm searchParams={searchParams} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="glass-effect rounded-lg p-1">
                    <ViewToggle
                      viewType={viewType}
                      onViewChange={setViewType}
                    />
                  </div>
                  <div className="glass-effect rounded-lg p-2 lg:hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMobileFilterOpen(true)}
                      className="text-white hover:bg-white/20 p-1"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 xxs:gap-6 xs:gap-6 sm:gap-8">
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-16 space-y-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-50 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                        <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h2 className="font-medium text-sm text-gray-900 dark:text-white">
                        Filters
                      </h2>
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs hover:bg-blue-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400"
                        asChild
                      >
                        <a href="/products">Reset</a>
                      </Button>
                    )}
                  </div>

                  <div className="p-3">
                    <FilterForm
                      categories={categories}
                      searchParams={searchParams}
                    />
                  </div>
                </div>

                {/* Quick Stats - Compact */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-3">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                      Quick Stats
                    </h3>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Products
                      </span>
                      <Badge variant="secondary" className="text-xs px-1.5">
                        {totalProducts}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Categories
                      </span>
                      <Badge variant="secondary" className="text-xs px-1.5">
                        {categories.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Page
                      </span>
                      <Badge variant="secondary" className="text-xs px-1.5">
                        {currentPage}/{totalPages}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* Main Content */}
            <div className="lg:col-span-4">
              {/* Products Grid */}
              <Suspense fallback={<ProductsLoading />}>
                <ProductsList products={products} viewType={viewType} />
              </Suspense>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 xxs:mt-8 xs:mt-12 sm:mt-16">
                  <div className="bg-white dark:bg-gray-800 rounded-xl xxs:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 xxs:p-6 xs:p-8">
                    <div className="text-center mb-4 xxs:mb-6">
                      <h3 className="text-sm xxs:text-base xs:text-lg font-semibold text-gray-900 dark:text-white mb-1 xxs:mb-2">
                        Page {currentPage} of {totalPages}
                      </h3>
                      <p className="text-xs xxs:text-sm text-gray-600 dark:text-gray-400">
                        Showing {(currentPage - 1) * 12 + 1} to{" "}
                        {Math.min(currentPage * 12, totalProducts)} of{" "}
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

          {/* Mobile Filter Modal */}
          <MobileFilterModal
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            hasActiveFilters={hasActiveFilters}
          >
            <FilterForm categories={categories} searchParams={searchParams} />
          </MobileFilterModal>
        </div>
      </div>
    </div>
  );
}
