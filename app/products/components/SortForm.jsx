"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortForm({ searchParams }) {
  return (
    <form id="sortForm" action="/products" method="GET">
      <Select
        defaultValue={searchParams?.sort || "featured"}
        onValueChange={(value) => {
          document.getElementById("sortValueInput").value = value;
          document.getElementById("sortForm").submit();
        }}
      >
        <SelectTrigger className="w-[180px] border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 focus:ring-blue-200 dark:focus:ring-blue-800">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="newest">Newest Arrivals</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="best-rated">Best Rated</SelectItem>
        </SelectContent>
      </Select>
      {/* Hidden inputs to preserve current filters */}
      <input
        type="hidden"
        id="sortValueInput"
        name="sort"
        value={searchParams?.sort || "featured"}
      />
      {searchParams?.search && (
        <input type="hidden" name="search" value={searchParams.search} />
      )}
      {searchParams?.category && (
        <input type="hidden" name="category" value={searchParams.category} />
      )}
      {searchParams?.minPrice && (
        <input type="hidden" name="minPrice" value={searchParams.minPrice} />
      )}
      {searchParams?.maxPrice && (
        <input type="hidden" name="maxPrice" value={searchParams.maxPrice} />
      )}
      {searchParams?.inStock && (
        <input type="hidden" name="inStock" value={searchParams.inStock} />
      )}
      {searchParams?.rating && (
        <input type="hidden" name="rating" value={searchParams.rating} />
      )}
      {searchParams?.page && (
        <input type="hidden" name="page" value={searchParams.page} />
      )}
    </form>
  );
}
