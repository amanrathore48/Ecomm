"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchForm({ searchParams }) {
  return (
    <form action="/products" method="GET" className="relative w-full md:w-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        name="search"
        placeholder="Search products..."
        className="pl-9 w-full md:w-[250px]"
        defaultValue={searchParams?.search || ""}
      />
      {/* Preserve other active filters when searching */}
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
      {searchParams?.sort && (
        <input type="hidden" name="sort" value={searchParams.sort} />
      )}
      <input type="hidden" name="page" value="1" />
    </form>
  );
}
