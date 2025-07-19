"use client";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useCartStore from "@/stores/zustand-cart";
import useWishlistStore from "@/stores/useWishlist";

// Import API helper functions
import { apiGet } from "@/helpers/api";

async function fetchProduct(productId) {
  try {
    // Enhanced logging to debug the API request
    console.log(`Sending API request for product ID/slug: ${productId}`);

    // Use our new apiGet function with enhanced error handling and retries
    const response = await apiGet(`/products/${productId}`, {
      timeout: 10000, // 10 seconds timeout for product details
      retries: 3, // Use 3 retries for product detail pages
      headers: {
        "Cache-Control": "no-cache", // Prevent browser caching
        "x-request-source": "product-detail-page", // For debugging and analytics
      },
    });

    console.log("Raw API Response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching product:", error);

    // Enhanced error handling with detailed messages based on error type
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw new Error("Request timed out. Please try again later.");
    } else if (
      error.name === "NetworkError" ||
      error.cause?.code === "UND_ERR_CONNECT_TIMEOUT"
    ) {
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    } else if (error.status === 404) {
      throw new Error("Product not found.");
    } else if (error.status === 503) {
      throw new Error(
        "Service temporarily unavailable. Our servers are experiencing high load."
      );
    } else if (
      error.message.includes("MongoDB") ||
      error.message.includes("ETIMEOUT")
    ) {
      throw new Error("Database connection issue. Please try again later.");
    } else if (error.data?.error) {
      throw new Error(error.data.error);
    }

    // Fallback error
    throw new Error("Failed to load product. Please try again later.");
  }
}

export default function ProductDetailPage({ params }) {
  const { productId } = params;
  const { toast } = useToast();

  console.log("Rendering ProductDetailPage with productId:", productId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isInWishlistLocal, setIsInWishlistLocal] = useState(false);
  const { data: session } = useSession();
  const { addItem: addToCart, loading: cartLoading } = useCartStore();
  const {
    addItem: addToWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlistStore();

  useEffect(() => {
    // If user is logged in, check if product is in wishlist
    if (session && product) {
      setIsInWishlistLocal(isInWishlist(product._id));
    }
  }, [session, product, isInWishlist]);

  useEffect(() => {
    // Prevent duplicate loading attempts that might cause loops
    if (hasAttemptedLoad) return;

    async function loadProduct(retryCount = 0) {
      setLoading(true);
      setHasAttemptedLoad(true);

      try {
        console.log(`Loading product ${productId} (attempt ${retryCount + 1})`);
        const data = await fetchProduct(productId);
        console.log("API Response:", data); // Add logging to debug response structure

        if (data) {
          console.log("Processing API response with data:", data);
          // More precise handling of different response formats
          let productData;

          // Case 1: Direct product data in the response object
          if (data._id && data.name) {
            productData = data;
          }
          // Case 2: Product is nested in product property
          else if (data.product && data.product._id) {
            productData = data.product;
          }
          // Case 3: Product might be the entire response if it has success:true
          else if (data.success && data._id) {
            productData = data;
          }

          console.log("Setting product data:", productData);

          // Ensure we have a valid product with essential properties
          if (productData && productData._id) {
            setProduct(productData);
            setRelatedProducts(data.relatedProducts || []);
          } else {
            console.error(
              "Invalid product data structure or missing ID:",
              data
            );
            setError(
              "The product information is incomplete. Please try another product."
            );
          }
        } else {
          console.error("Invalid product data structure:", data);
          setError("Product not found");
          // Instead of notFound() which might cause navigation, show error UI
          // notFound();
        }
      } catch (err) {
        console.error(
          `Error loading product (attempt ${retryCount + 1}):`,
          err
        );

        // Retry up to 2 times for connection timeout errors
        if (
          (err.cause?.code === "UND_ERR_CONNECT_TIMEOUT" ||
            err.name === "AbortError") &&
          retryCount < 2
        ) {
          setLoading(false);
          // Wait for a second before retrying
          setTimeout(() => loadProduct(retryCount + 1), 1000);
          return;
        }

        // Show appropriate error message to the user
        let errorMessage = "Failed to load product. Please try again later.";

        if (
          err.message.includes("MongoDB") ||
          err.message.includes("ETIMEOUT")
        ) {
          errorMessage = "Database connection issue. Please try again later.";
        } else if (err.message.includes("Connection to server timed out")) {
          errorMessage =
            "Connection to server timed out. Please check your internet connection.";
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId, hasAttemptedLoad]);

  // Display loading state during initial load
  if (loading && !product) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Display error state without redirecting
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-red-700 mb-4">
            Error Loading Product
          </h1>
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-600">
            Please try refreshing the page or go back to browse other products.
          </p>
          <Button className="mt-4" asChild>
            <a href="/products">Return to Products</a>
          </Button>
        </div>
      </div>
    );
  }

  // Don't use notFound() as it might be causing navigation issues
  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-amber-700 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600">
            The product you're looking for could not be found.
          </p>
          <Button className="mt-4" asChild>
            <a href="/products">Browse All Products</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      if (product && product._id) {
        await addToCart(product, quantity);
        toast({
          title: "Added to Cart",
          description: "Item has been added to your cart",
          duration: 3000,
        });
      } else {
        throw new Error("Invalid product data");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add item to cart",
      });
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (!session) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to add items to your wishlist",
          variant: "destructive",
        });
        return;
      }
      await addToWishlist(product);
      setIsInWishlistLocal(!isInWishlistLocal);
      toast({
        title: isInWishlistLocal
          ? "Removed from Wishlist"
          : "Added to Wishlist",
        description: isInWishlistLocal
          ? "Item has been removed from your wishlist"
          : "Item has been added to your wishlist",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update wishlist",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images - Enhanced Gallery (Similar to Flipkart/Amazon) */}
        <div className="lg:w-1/2">
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Vertical thumbnails for larger screens */}
            {product.images.length > 1 && (
              <div className="hidden lg:flex flex-col gap-3 overflow-y-auto max-h-[500px] py-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                      index === activeImageIndex
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                    onMouseEnter={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={image || "/placeholder-product.jpg"}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main image container */}
            <div className="flex-1">
              <div className="relative">
                {/* Main image with zoom effect */}
                <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 shadow-md bg-white">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={
                        product.images[activeImageIndex] ||
                        "/placeholder-product.jpg"
                      }
                      alt={product.name}
                      fill
                      className="object-contain transition-all duration-300 hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>

                  {/* Navigation arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === 0 ? product.images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-md z-10 transition-all duration-200 hover:scale-110"
                        aria-label="Previous image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === product.images.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-md z-10 transition-all duration-200 hover:scale-110"
                        aria-label="Next image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  {product.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
                      {activeImageIndex + 1} / {product.images.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Horizontal thumbnails for mobile */}
              {product.images.length > 1 && (
                <div className="flex lg:hidden gap-2 mt-4 overflow-x-auto pb-2 snap-x scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative min-w-[80px] w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 snap-start ${
                        index === activeImageIndex
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder-product.jpg"}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details - Enhanced UI */}
        <div className="lg:w-1/2">
          {/* Brand and name */}
          {product.brand && (
            <div className="text-sm text-primary font-medium mb-2">
              {product.brand}
            </div>
          )}
          <h1 className="text-2xl font-semibold mb-3 font-heading">
            {product.name}
          </h1>

          {/* Rating and reviews */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">
              {product.reviews?.length || 0} reviews
            </span>
          </div>

          {/* Price section */}
          <div className="mb-6">
            {product.discount ? (
              <div className="flex items-center gap-2">
                <p className="text-xl font-medium text-primary">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </p>
                <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              </div>
            ) : (
              <p className="text-xl font-medium">${product.price.toFixed(2)}</p>
            )}
          </div>

          {/* Short description */}
          <div className="bg-muted/30 p-4 rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">
              {product.shortDescription ||
                product.description?.substring(0, 150) +
                  (product.description?.length > 150 ? "..." : "")}
            </p>
          </div>

          {/* Key features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-muted-foreground">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stock and availability */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded flex items-center">
                <span className="h-2 w-2 bg-green-600 rounded-full mr-1"></span>
                In Stock ({product.stock} available)
              </div>
            ) : (
              <div className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded flex items-center">
                <span className="h-2 w-2 bg-red-600 rounded-full mr-1"></span>
                Out of Stock
              </div>
            )}

            {product.freeShipping && (
              <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                Free Shipping
              </div>
            )}
          </div>

          {/* Quantity selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity:</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="rounded-none h-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center border-x">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock || product.stock <= 0}
                  className="rounded-none h-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              className="flex-1 py-6"
              size="lg"
              variant="default"
              onClick={handleAddToCart}
              disabled={cartLoading || product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {cartLoading
                ? "Adding..."
                : product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`h-12 w-12 ${
                isInWishlistLocal ? "text-primary hover:text-primary" : ""
              }`}
              onClick={handleAddToWishlist}
              disabled={wishlistLoading}
            >
              <Heart
                className={`h-5 w-5 ${isInWishlistLocal ? "fill-current" : ""}`}
              />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: product.shortDescription || product.name,
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full border-b mb-6 pb-0 font-medium">
            <TabsTrigger value="description" className="text-sm">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="text-sm">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-sm">
              Reviews ({product.reviews?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div className="prose max-w-none text-muted-foreground">
              <p className="text-sm leading-relaxed">{product.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-4">
            <div className="grid gap-3">
              {product.specifications?.map((spec, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-md border border-muted/20"
                >
                  <div className="text-sm font-medium">{spec.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {spec.value}
                  </div>
                </div>
              ))}
              {(!product.specifications ||
                product.specifications.length === 0) && (
                <p className="text-center py-6 text-sm text-muted-foreground">
                  No specifications available
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-primary" : "fill-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
