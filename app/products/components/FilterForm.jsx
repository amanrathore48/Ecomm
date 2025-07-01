"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FilterForm({ categories, searchParams }) {
  return (
    <form action="/products" method="GET" className="space-y-6">
      {/* Categories filter */}
      <div className="pb-5 border-b">
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center">
              <input
                type="checkbox"
                name="category"
                value={category.id}
                id={`category-${category.id}`}
                className="h-4 w-4 rounded border-gray-300"
                defaultChecked={searchParams?.category === category.id}
                onChange={(e) => {
                  if (e.target.form) e.target.form.submit();
                }}
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
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            name="minPrice"
            placeholder="Min"
            className="h-9"
            defaultValue={searchParams?.minPrice || ""}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            name="maxPrice"
            placeholder="Max"
            className="h-9"
            defaultValue={searchParams?.maxPrice || ""}
          />
          <Button type="submit" size="sm" className="h-9">
            Go
          </Button>
        </div>
      </div>

      {/* Availability filter */}
      <div className="py-5 border-b">
        <h3 className="font-medium mb-3">Availability</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="in-stock"
              name="inStock"
              value="true"
              className="h-4 w-4 rounded border-gray-300"
              defaultChecked={searchParams?.inStock === "true"}
              onChange={(e) => {
                if (e.target.form) e.target.form.submit();
              }}
            />
            <label htmlFor="in-stock" className="ml-2 text-sm">
              In Stock
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="out-of-stock"
              name="inStock"
              value="false"
              className="h-4 w-4 rounded border-gray-300"
              defaultChecked={searchParams?.inStock === "false"}
              onChange={(e) => {
                if (e.target.form) e.target.form.submit();
              }}
            />
            <label htmlFor="out-of-stock" className="ml-2 text-sm">
              Out of Stock
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="all-stock"
              name="inStock"
              value=""
              className="h-4 w-4 rounded border-gray-300"
              defaultChecked={!searchParams?.inStock}
              onChange={(e) => {
                if (e.target.form) e.target.form.submit();
              }}
            />
            <label htmlFor="all-stock" className="ml-2 text-sm">
              All Products
            </label>
          </div>
        </div>
      </div>

      {/* Rating filter */}
      <div className="pt-5">
        <h3 className="font-medium mb-3">Rating</h3>
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
                onChange={(e) => {
                  if (e.target.form) e.target.form.submit();
                }}
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
