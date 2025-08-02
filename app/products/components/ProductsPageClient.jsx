"use client";
import React from "react";
import {
  Filter,
  Search,
  Grid3X3,
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
  Clock,
  Zap,
  MoreHorizontal,
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
          ? "grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 xxs:gap-3 xs:gap-4 sm:gap-5 lg:gap-6"
          : "flex flex-col gap-2 xxs:gap-3 xs:gap-4 sm:gap-5"
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

.bg-grid-white\/\[0\.02\] {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M96,95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-10,0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9zm10,0h9v-9h-9v9z' fill='white' opacity='0.05'/%3E%3C/svg%3E");
}

.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
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
        <div className="w-full max-w-[2000px] mx-auto px-2 xxs:px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-10 py-2 xxs:py-3 xs:py-4 sm:py-6 md:py-8 lg:py-10">
          {/* Enhanced Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 lg:mb-8 shadow-lg">
            {/* Background pattern/effect */}
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            <div className="absolute right-0 top-0 w-32 h-32 md:w-64 md:h-64 bg-purple-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute left-0 bottom-0 w-32 h-32 md:w-64 md:h-64 bg-blue-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:20px_20px]"></div>

            {/* Content Container */}
            <div className="relative p-3 sm:p-5 md:p-6 lg:p-7">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 lg:gap-6">
                <div className="flex-1">
                  {/* Products count with visual indicator */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
                      <span className="text-white font-medium text-sm">
                        {totalProducts.toLocaleString()} Products
                      </span>
                    </div>

                    {/* Active filters badge */}
                    {hasActiveFilters && (
                      <Badge className="bg-green-500/15 text-white border-green-400/20 text-xs py-1 px-2">
                        <Filter className="w-3 h-3 mr-1" />
                        <span>Filtered</span>
                      </Badge>
                    )}

                    {/* Search parameter badge */}
                    {searchParams?.search && (
                      <Badge className="bg-white/15 text-white border-white/20 text-xs py-1 px-2">
                        <Search className="w-3 h-3 mr-1" />
                        <span className="max-w-[80px] sm:max-w-[120px] md:max-w-[200px] truncate">
                          {searchParams.search}
                        </span>
                      </Badge>
                    )}

                    {/* Category badge */}
                    {searchParams?.category && (
                      <Badge className="bg-purple-500/15 text-white border-purple-400/20 text-xs py-1 px-2">
                        <Tag className="w-3 h-3 mr-1" />
                        <span className="max-w-[80px] sm:max-w-[120px] md:max-w-[200px] truncate">
                          {searchParams.category}
                        </span>
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Controls - grouped together on right side */}
                <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Sort controls - moved to right side */}
                  <div className="flex items-center gap-1.5 order-1 sm:order-2">
                    <span className="text-xs text-white/80 font-medium hidden xs:inline">
                      Sort by:
                    </span>
                    <div className="glass-effect rounded-lg p-1 backdrop-blur-md bg-white/15">
                      <SortForm searchParams={searchParams} />
                    </div>
                  </div>

                  {/* View toggle */}
                  <div className="flex items-center gap-2 order-2 sm:order-1">
                    <div className="glass-effect rounded-lg p-1 backdrop-blur-md bg-white/15 border border-white/20">
                      <ViewToggle
                        viewType={viewType}
                        onViewChange={setViewType}
                      />
                    </div>

                    {/* Mobile filter button */}
                    <div className="glass-effect rounded-lg p-0.5 backdrop-blur-md bg-white/15 border border-white/20 lg:hidden">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="text-white hover:bg-white/20 hover:text-white p-1.5 rounded-md"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Row - Hidden on mobile */}
              <div className="hidden md:grid md:grid-cols-4 gap-3 mt-4">
                {[
                  { label: "New Today", value: "127", icon: Clock },
                  { label: "On Sale", value: "89", icon: Tag },
                  { label: "Featured", value: "43", icon: Star },
                  { label: "Trending", value: "156", icon: TrendingUp },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/15 flex items-center"
                  >
                    <div className="w-6 h-6 flex-shrink-0 bg-white/5 rounded-full flex items-center justify-center mr-2">
                      <stat.icon className="w-3 h-3 text-white/80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white/70 text-xs font-medium truncate">
                        {stat.label}
                      </div>
                      <div className="text-white text-sm font-semibold">
                        {stat.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-6 gap-4 xxs:gap-5 xs:gap-6 md:gap-7 lg:gap-8">
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
            </div>
            {/* Main Content */}
            <div className="lg:col-span-4 xl:col-span-5">
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
