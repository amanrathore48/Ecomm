"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, ShoppingCart, Eye, Star, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/currency";
import { useToast } from "@/components/ui/use-toast";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import useCartStore from "@/stores/zustand-cart";
import useWishlistStore from "@/stores/useWishlist";

export function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { toast } = useToast();

  // Default product if none is provided
  const defaultProduct = {
    _id: "default",
    name: "Product Name",
    price: 4999, // Price in INR
    mainImage: "https://via.placeholder.com/300x300",
    rating: 4.5,
    reviews: 12,
    stock: 10,
  };

  // Process the product data to ensure consistent structure
  let p = product || defaultProduct;

  // If no mainImage but has images array, add mainImage for consistent API
  if (!p.mainImage && p.images && p.images.length > 0) {
    p = {
      ...p,
      mainImage: p.images[0],
    };
  }

  // Discount percentage calculation
  const discountPercentage = p.discount ? p.discount : 0;

  // Calculate sale price if there's a discount
  const salePrice = p.discount ? p.price * (1 - p.discount / 100) : p.price;

  // Check if product is new (less than 14 days old)
  const isNew =
    p.createdAt &&
    (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24) < 14;

  // Check if product is on sale
  const isSale = p.discount && p.discount > 0;

  // Check if it's a bestseller (mock logic - could be based on sales data)
  const isBestseller = p.reviews && p.reviews > 50 && p.rating > 4.0;

  const { data: session } = useSession();
  const { isInWishlist } = useWishlistStore();
  const [isInWishlistLocal, setIsInWishlistLocal] = useState(
    isInWishlist(p._id)
  );

  useEffect(() => {
    if (session && p) {
      setIsInWishlistLocal(isInWishlist(p._id));
    }
  }, [session, p, isInWishlist]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { addItem, loading } = useCartStore.getState();
    if (loading) return;

    try {
      if (!p || !p._id) {
        throw new Error("Invalid product data");
      }

      await addItem(p, 1);
      toast({
        title: "Added to Cart",
        description: `${p.name} added to cart successfully`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add item to cart",
      });
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { addItem, loading } = useWishlistStore.getState();
    if (loading) return;

    try {
      if (!session) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to add items to your wishlist",
          variant: "destructive",
        });
        return;
      }

      await addItem(p);
      setIsInWishlistLocal(!isInWishlistLocal);
      toast({
        description: `${p.name} ${
          isInWishlistLocal ? "removed from" : "added to"
        } wishlist`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add item to wishlist",
      });
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view functionality would be implemented here
  };

  return (
    <div
      className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product badges */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-20 flex flex-col gap-1">
        {isNew && (
          <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1">
            <Zap className="w-3 h-3 mr-1" />
            New
          </Badge>
        )}
        {isSale && (
          <Badge className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 font-bold">
            -{discountPercentage}%
          </Badge>
        )}
        {isBestseller && (
          <Badge className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Best
          </Badge>
        )}
      </div>

      {/* Wishlist button - always visible on mobile, hover on desktop */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20">
        <Button
          size="icon"
          variant="secondary"
          className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isInWishlistLocal
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
              : "bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
          } ${
            isHovered || window.innerWidth < 768
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90 sm:group-hover:opacity-100 sm:group-hover:scale-100"
          }`}
          onClick={handleAddToWishlist}
        >
          <Heart
            className={`h-4 w-4 transition-all duration-200 ${
              isInWishlistLocal
                ? "fill-current text-red-600 dark:text-red-400"
                : ""
            }`}
          />
        </Button>
      </div>

      {/* Product image with enhanced overlay */}
      <Link href={`/products/${p.slug || p._id}`} className="block">
        <div className="relative h-48 sm:h-56 md:h-64 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {/* Image loading skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />
          )}

          <ImageWithFallback
            src={p.mainImage || p.images || p.img}
            alt={p.name || "Product image"}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
            onLoad={() => setImageLoading(false)}
          />

          {/* Enhanced action buttons overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
              onClick={handleQuickView}
            >
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Mobile: Show add to cart in overlay, Desktop: Keep it at bottom */}
            <div className="sm:hidden">
              <Button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
                disabled={!(p.stock > 0) || useCartStore.getState().loading}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {useCartStore.getState().loading
                  ? "Adding..."
                  : p.stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </Button>
            </div>
          </div>

          {/* Stock indicator */}
          {p.stock <= 5 && p.stock > 0 && (
            <div className="absolute bottom-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
              Only {p.stock} left!
            </div>
          )}
        </div>
      </Link>

      {/* Enhanced product info */}
      <div className="p-3 sm:p-4">
        <Link href={`/products/${p.slug || p._id}`} className="block">
          <h3 className="font-semibold text-sm sm:text-base lg:text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 mb-2 leading-tight">
            {p.name}
          </h3>
        </Link>

        {/* Categories - more compact on mobile */}
        {p.categories && p.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {p.categories.slice(0, 2).map((category, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-0.5 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600"
              >
                {category}
              </Badge>
            ))}
            {p.categories.length > 2 && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 text-gray-500"
              >
                +{p.categories.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Rating with better mobile layout */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                    star <= Math.floor(p.rating || 0)
                      ? "text-yellow-500 fill-yellow-500"
                      : star - 0.5 <= (p.rating || 0)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              ({p.reviews || 0})
            </span>
          </div>

          {p.stock > 0 && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs">In Stock</span>
            </div>
          )}
        </div>

        {/* Enhanced price display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {formatPrice(salePrice)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(p.price)}
              </span>
            )}
          </div>
          {discountPercentage > 0 && (
            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
              Save {formatPrice(p.price - salePrice)}
            </div>
          )}
        </div>

        {/* Add to cart button - hidden on mobile (shown in overlay) */}
        <div className="hidden sm:block">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:shadow-lg rounded-lg py-2.5"
            disabled={!(p.stock > 0) || useCartStore.getState().loading}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {useCartStore.getState().loading
              ? "Adding..."
              : p.stock > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </Button>
        </div>

        {/* Mobile: Compact add to cart button */}
        <div className="sm:hidden">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 rounded-lg py-2"
            disabled={!(p.stock > 0) || useCartStore.getState().loading}
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {useCartStore.getState().loading
              ? "Adding..."
              : p.stock > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
