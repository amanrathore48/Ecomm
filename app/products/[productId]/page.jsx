"use client";

import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Zap,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";
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
    console.log(`Sending API request for product ID/slug: ${productId}`);

    const response = await apiGet(`/products/${productId}`, {
      timeout: 10000,
      retries: 3,
      headers: {
        "Cache-Control": "no-cache",
        "x-request-source": "product-detail-page",
      },
    });

    console.log("Raw API Response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching product:", error);

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
  const [activeImageIndex, setActiveImageIndex] = useState(0); // 0 = mainImage, 1+ = images array
  const [isInWishlistLocal, setIsInWishlistLocal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { data: session } = useSession();
  const { addItem: addToCart, loading: cartLoading } = useCartStore();
  const {
    addItem: addToWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlistStore();

  useEffect(() => {
    if (session && product) {
      setIsInWishlistLocal(isInWishlist(product._id));
    }
  }, [session, product, isInWishlist]);

  useEffect(() => {
    if (hasAttemptedLoad) return;

    async function loadProduct(retryCount = 0) {
      setLoading(true);
      setHasAttemptedLoad(true);

      try {
        console.log(`Loading product ${productId} (attempt ${retryCount + 1})`);
        const data = await fetchProduct(productId);
        console.log("API Response:", data);

        if (data) {
          console.log("Processing API response with data:", data);
          let productData;

          if (data._id && data.name) {
            productData = data;
          } else if (data.product && data.product._id) {
            productData = data.product;
          } else if (data.success && data._id) {
            productData = data;
          }

          console.log("Setting product data:", productData);

          if (productData && productData._id) {
            // Initialize images array if it doesn't exist
            if (!productData.images) {
              productData.images = [];
            }

            // Ensure we don't duplicate the main image in the images array
            if (
              productData.mainImage &&
              productData.images.includes(productData.mainImage)
            ) {
              productData.images = productData.images.filter(
                (img) => img !== productData.mainImage
              );
            }

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
        }
      } catch (err) {
        console.error(
          `Error loading product (attempt ${retryCount + 1}):`,
          err
        );

        if (
          (err.cause?.code === "UND_ERR_CONNECT_TIMEOUT" ||
            err.name === "AbortError") &&
          retryCount < 2
        ) {
          setLoading(false);
          setTimeout(() => loadProduct(retryCount + 1), 1000);
          return;
        }

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

  // Enhanced loading state with skeleton
  if (loading && !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()} className="flex-1">
              Try Again
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white border border-amber-200 rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="w-full">
            <a href="/products">Explore All Products</a>
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
          title: "Added to Cart! 🛒",
          description: `${quantity} × ${product.name} added successfully`,
          duration: 3000,
        });
      } else {
        throw new Error("Invalid product data");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: error.message || "Failed to add item to cart",
      });
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (!session) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to save items to your wishlist",
          variant: "destructive",
        });
        return;
      }
      await addToWishlist(product);
      setIsInWishlistLocal(!isInWishlistLocal);
      toast({
        title: isInWishlistLocal
          ? "Removed from Wishlist"
          : "Added to Wishlist! ❤️",
        description: isInWishlistLocal
          ? "Item removed from your wishlist"
          : "Item saved to your wishlist",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update wishlist",
      });
    }
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription || product.name,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Product link copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Breadcrumb */}
      <div className="border-b bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
              <a
                href="/products"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Enhanced Image Gallery */}
          <div className="space-y-6">
            {/* Main Image Display */}
            <div className="relative group">
              <div className="aspect-square bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 shadow-lg overflow-hidden relative">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
                <Image
                  src={
                    activeImageIndex === 0 && product.mainImage
                      ? product.mainImage
                      : (product.images &&
                          product.images[activeImageIndex - 1]) ||
                        product.mainImage ||
                        "/placeholder-product.jpg"
                  }
                  alt={product.name}
                  fill
                  className={`object-contain transition-all duration-500 hover:scale-105 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onLoad={() => setImageLoading(false)}
                />

                {/* Enhanced Navigation */}
                {(product.images?.length > 0 || product.mainImage) && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === 0 ? product.images?.length || 0 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev >= (product.images?.length || 0) ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {(product.images?.length > 0 || product.mainImage) && (
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {activeImageIndex + 1} / {(product.images?.length || 0) + 1}
                  </div>
                )}

                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1">
                      -{product.discount}% OFF
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
              {/* Main Image Thumbnail */}
              {product.mainImage && (
                <button
                  onClick={() => setActiveImageIndex(0)}
                  className={`relative min-w-[80px] w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImageIndex === 0
                      ? "border-primary ring-2 ring-primary/20 scale-105"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={product.mainImage || "/placeholder-product.jpg"}
                    alt={`${product.name} main view`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              )}

              {/* Additional Images Thumbnails */}
              {product.images &&
                product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index + 1)}
                    className={`relative min-w-[80px] w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      index + 1 === activeImageIndex
                        ? "border-primary ring-2 ring-primary/20 scale-105"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
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
          </div>

          {/* Enhanced Product Details */}
          <div className="space-y-6">
            {/* Brand and Title */}
            <div className="space-y-3">
              {product.brand && (
                <Badge variant="secondary" className="text-primary font-medium">
                  {product.brand}
                </Badge>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 font-medium">
                {product.rating?.toFixed(1) || "0.0"}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {product.reviews?.length || 0} reviews
              </span>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-gray-900 p-6 rounded-2xl border dark:border-gray-800">
              {product.discount ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary">
                      ₹
                      {(product.price * (1 - product.discount / 100)).toFixed(
                        0
                      )}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.price.toFixed(0)}
                    </span>
                  </div>
                  <div className="text-green-600 font-medium">
                    You save ₹
                    {((product.price * product.discount) / 100).toFixed(0)} (
                    {product.discount}% off)
                  </div>
                </div>
              ) : (
                <span className="text-3xl font-bold text-primary">
                  ₹{product.price.toFixed(0)}
                </span>
              )}
            </div>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock and Shipping Info */}
            <div className="flex flex-wrap gap-3">
              {product.stock > 0 ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {product.stock > 10
                    ? "In Stock"
                    : `Only ${product.stock} left`}
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 px-3 py-1">
                  <X className="w-4 h-4 mr-1" />
                  Out of Stock
                </Badge>
              )}

              {product.freeShipping && (
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1">
                  <Truck className="w-4 h-4 mr-1" />
                  Free Shipping
                </Badge>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white dark:bg-gray-900 border-2 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="rounded-none h-12 w-12 hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="w-16 h-12 flex items-center justify-center border-x-2 font-semibold">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock || product.stock <= 0}
                    className="rounded-none h-12 w-12 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  ₹
                  {(
                    (product.discount
                      ? product.price * (1 - product.discount / 100)
                      : product.price) * quantity
                  ).toFixed(0)}{" "}
                  total
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-blue-700 shadow-lg"
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.stock <= 0}
                >
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  {cartLoading
                    ? "Adding..."
                    : product.stock > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className={`h-14 w-14 border-2 transition-all duration-200 ${
                    isInWishlistLocal
                      ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                      : "hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  }`}
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isInWishlistLocal ? "fill-current" : ""
                    }`}
                  />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 border-2 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  onClick={shareProduct}
                >
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t dark:border-gray-800">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Secure Payment
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <RotateCcw className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Easy Returns
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <Truck className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Fast Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs Section */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <div className="border-b dark:border-gray-800">
              <TabsList className="w-full justify-start bg-transparent h-auto p-0">
                <TabsTrigger
                  value="description"
                  className="px-6 py-4 text-base font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary dark:data-[state=active]:border-blue-400 rounded-none bg-transparent dark:text-gray-200"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="px-6 py-4 text-base font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary dark:data-[state=active]:border-blue-400 rounded-none bg-transparent dark:text-gray-200"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="px-6 py-4 text-base font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary dark:data-[state=active]:border-blue-400 rounded-none bg-transparent dark:text-gray-200"
                >
                  Reviews ({product.reviews?.length || 0})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="description" className="mt-8">
              <div className="prose max-w-none dark:prose-invert">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border dark:border-gray-800 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {product.description}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-8">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 shadow-sm overflow-hidden">
                {product.specifications?.length > 0 ? (
                  <div className="divide-y dark:divide-gray-800">
                    {product.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 px-8 py-6"
                      >
                        <div className="font-semibold text-gray-900 dark:text-gray-200">
                          {spec.name}
                        </div>
                        <div className="text-gray-700 dark:text-gray-300">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-2">
                      <Zap className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      No specifications available
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 shadow-sm">
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="divide-y dark:divide-gray-800">
                    {product.reviews.map((review) => (
                      <div key={review._id} className="p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-primary">
                                {review.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-gray-200">
                                {review.user.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                      <Star className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                You might also like
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Discover similar products that other customers love
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="group">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <ProductCard product={relatedProduct} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Top Button */}
        <div className="fixed bottom-8 right-8 z-20">
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary-dark"
            size="icon"
          >
            <ChevronLeft className="w-5 h-5 rotate-90" />
          </Button>
        </div>
      </div>
    </div>
  );
}
