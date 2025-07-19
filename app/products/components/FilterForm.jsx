"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function FilterForm({ categories, searchParams }) {
  const router = useRouter();
  // Parse searchParams.category as an array
  const initialSelectedCategories = searchParams?.category
    ? Array.isArray(searchParams.category)
      ? searchParams.category
      : [searchParams.category]
    : [];

  const [selectedCategories, setSelectedCategories] = useState(
    initialSelectedCategories
  );
  const [minPrice, setMinPrice] = useState(searchParams?.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(searchParams?.maxPrice || "");
  const [inStock, setInStock] = useState(searchParams?.inStock || "");

  // Handle category checkbox change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Apply all filters
  const applyFilters = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    // Add selected categories
    selectedCategories.forEach((cat) => {
      params.append("category", cat);
    });

    // Add other filters
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStock) params.set("inStock", inStock);

    // Preserve other searchParams
    if (searchParams?.sort) params.set("sort", searchParams.sort);
    if (searchParams?.rating) params.set("rating", searchParams.rating);
    if (searchParams?.page) params.set("page", "1"); // Reset to page 1 when filters change
    if (searchParams?.search) params.set("search", searchParams.search);

    // Navigate with the new params
    router.push(`/products?${params.toString()}`);
  };

  return (
    <form onSubmit={applyFilters} className="space-y-6">
      {/* Categories filter */}
      <div className="pb-5 border-b">
        <h3 className="text-sm font-medium mb-2.5">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category.id}`}
                className="h-4 w-4 rounded border-gray-300"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              />
              <label
                htmlFor={`category-${category.id}`}
                className="ml-2 text-sm flex-1"
              >
                {category.name}
              </label>
              <span className="text-xs text-muted-foreground">
                ({category.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price range filter */}
      <div className="py-5 border-b">
        <h3 className="text-sm font-medium mb-2.5">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="h-9"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            className="h-9"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Availability filter */}
      <div className="py-5 border-b">
        <h3 className="text-sm font-medium mb-2.5">Availability</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="in-stock"
              value="true"
              className="h-4 w-4 rounded border-gray-300"
              checked={inStock === "true"}
              onChange={() => setInStock("true")}
            />
            <label htmlFor="in-stock" className="ml-2 text-sm">
              In Stock
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="out-of-stock"
              value="false"
              className="h-4 w-4 rounded border-gray-300"
              checked={inStock === "false"}
              onChange={() => setInStock("false")}
            />
            <label htmlFor="out-of-stock" className="ml-2 text-sm">
              Out of Stock
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="all-stock"
              value=""
              className="h-4 w-4 rounded border-gray-300"
              checked={inStock === ""}
              onChange={() => setInStock("")}
            />
            <label htmlFor="all-stock" className="ml-2 text-sm">
              All Products
            </label>
          </div>
        </div>
      </div>

      {/* Rating filter */}
      <div className="pt-5 border-b pb-5">
        <h3 className="text-sm font-medium mb-2.5">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={rating}
                id={`rating-${rating}`}
                className="h-4 w-4 rounded border-gray-300"
                defaultChecked={searchParams?.rating === rating.toString()}
              />
              <label
                htmlFor={`rating-${rating}`}
                className="ml-2 text-sm flex items-center"
              >
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                {rating === 5 ? " & up" : ""}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden sort input to preserve sort order when filtering */}
      {searchParams?.sort && (
        <input type="hidden" name="sort" value={searchParams.sort} />
      )}

      {/* Hidden search input to preserve search when filtering */}
      {searchParams?.search && (
        <input type="hidden" name="search" value={searchParams.search} />
      )}

      {/* Hidden page input to reset to page 1 when filtering */}
      <input type="hidden" name="page" value="1" />

      <div className="mt-6">
        <Button type="submit" className="w-full">
          Apply Filters
        </Button>
      </div>
    </form>
  );
}
