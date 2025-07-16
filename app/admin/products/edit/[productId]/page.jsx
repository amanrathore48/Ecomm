"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../../_components/product-form";
import { Loader2 } from "lucide-react";
import { apiGet } from "@/helpers/api";
import { notFound } from "next/navigation";

export default function EditProductPage({ params }) {
  const { productId } = params;
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        // Try to fetch product by ID or slug - this will work with both
        const response = await apiGet(`/admin/products/${productId}`, {
          retries: 2,
          timeout: 8000,
        });

        if (response?.product) {
          console.log(
            `Product loaded successfully. ID: ${response.product._id}, Slug: ${response.product.slug}`
          );
          setProduct(response.product);
        } else {
          setError("Product not found");
          notFound();
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-destructive">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-destructive">Not Found</h2>
        <p className="text-muted-foreground">Product could not be found</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
