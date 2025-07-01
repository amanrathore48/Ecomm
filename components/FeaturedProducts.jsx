"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FeaturedProducts({ hideWhenEmpty = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch featured products (limit to 4)
        const response = await fetch("/api/products?featured=true&limit=4");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        const productList = data.products || [];
        setProducts(productList);

        // Hide the entire section if no products and hideWhenEmpty is true
        if (hideWhenEmpty && productList.length === 0) {
          setShouldShow(false);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError(err.message);
        if (hideWhenEmpty) {
          setShouldShow(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [hideWhenEmpty]);

  // Don't render anything if we shouldn't show the section
  if (!shouldShow) {
    return null;
  }

  if (loading) {
    return (
      <>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-card border rounded-lg overflow-hidden">
              <div className="h-48 bg-muted/30 animate-pulse"></div>
              <div className="p-4">
                <div className="h-4 bg-muted/50 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-muted/50 rounded w-1/2 mb-4 animate-pulse"></div>
                <div className="h-8 bg-muted/50 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
      </>
    );
  }

  if (error) {
    return (
      <div className="col-span-full">
        <EmptyState
          icon="⚠️"
          title="Oops! Something went wrong"
          description={error}
        />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyState
          icon="🔍"
          title="No featured products yet"
          description="Check back later for featured products or explore our catalog"
          actionLink="/products"
          actionLabel="View All Products"
        />
      </div>
    );
  }

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
      {products.length < 4 && (
        <div className="col-span-full mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      )}
    </>
  );
}
