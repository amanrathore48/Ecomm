"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Zap,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Check,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ImageWithFallback } from "@/components/ui/image-with-fallback.js";
import useCartStore from "@/stores/zustand-cart";
import useWishlistStore from "@/stores/useWishlist";

export function ProductCard({ product = {}, variant = "featured" }) {
  // Variants:
  // "compact" - Minimal info for dense product listings (grid view)
  // "featured" - Standard card with full details for homepage/category pages
  // "hero" - Large showcase card for promotions/featured products
  // "minimal" - Ultra-clean for premium layouts
  // "detailed" - Maximum information display for list view layout
  // "list" - Horizontal layout for list view with extended details

  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Default product if none is provided
  const defaultProduct = {
    _id: "default",
    name: "Premium Product Name",
    price: 4999,
    mainImage: "https://via.placeholder.com/400x400",
    rating: 4.5,
    numReviews: 12,
    stock: 10,
    discount: 25,
    brand: "Premium Brand",
  };

  let p = product || defaultProduct;

  // Ensure we have mainImage
  if (!p.mainImage && p.images && p.images.length > 0) {
    p = { ...p, mainImage: p.images[0] };
  }

  // Price calculations
  const originalPrice = Number(p?.price) || 0;
  const discountPercentage = p?.discount !== undefined ? Number(p.discount) : 0;
  const discountedPrice =
    discountPercentage > 0
      ? Math.round(originalPrice * (1 - discountPercentage / 100))
      : originalPrice;
  const savings = originalPrice - discountedPrice;

  // Product status checks
  const isNew =
    p.createdAt &&
    (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24) < 14;
  const isSale = discountPercentage > 0;
  const isBestseller = (p.numReviews || 0) > 50 && (p.rating || 0) > 4.0;
  const isLowStock = p.stock <= 5 && p.stock > 0;
  const isOutOfStock = p.stock <= 0;

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

  // Variant configurations
  const variantConfig = {
    compact: {
      containerClass: "rounded-lg hover:shadow-lg hover:-translate-y-1",
      imageHeight: "h-32 sm:h-36 md:h-40",
      padding: "p-2 md:p-3",
      spacing: "space-y-1.5 md:space-y-2",
      titleSize: "text-sm font-semibold min-h-[2rem]",
      showBrand: false,
      showCategories: false,
      showDescription: false,
      showColors: false,
      showSizes: false,
      showDetailedPrice: false,
      showDeliveryInfo: false,
      showQuickView: false,
      buttonSize: "h-8 text-xs",
      maxBadges: 1,
    },
    featured: {
      containerClass:
        "rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-3",
      imageHeight: "h-48 sm:h-56 md:h-64",
      padding: "p-4 md:p-5",
      spacing: "space-y-3 md:space-y-4",
      titleSize: "text-base md:text-lg font-bold min-h-[2.5rem]",
      showBrand: true,
      showCategories: true,
      showDescription: false,
      showColors: true,
      showSizes: true,
      showDetailedPrice: false,
      showDeliveryInfo: true,
      showQuickView: true,
      buttonSize: "h-12 text-base",
      maxBadges: 3,
    },
    hero: {
      containerClass:
        "rounded-3xl hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-4",
      imageHeight: "h-64 md:h-80 lg:h-96",
      padding: "p-6 md:p-8",
      spacing: "space-y-4 md:space-y-6",
      titleSize: "text-lg md:text-xl lg:text-2xl font-bold min-h-[3rem]",
      showBrand: true,
      showCategories: true,
      showDescription: true,
      showColors: true,
      showSizes: true,
      showDetailedPrice: true,
      showDeliveryInfo: true,
      showQuickView: true,
      buttonSize: "h-14 lg:h-16 text-lg",
      maxBadges: 3,
    },
    minimal: {
      containerClass: "rounded-xl hover:shadow-md hover:-translate-y-1",
      imageHeight: "h-40 sm:h-48 md:h-56",
      padding: "p-3 md:p-4",
      spacing: "space-y-2 md:space-y-3",
      titleSize: "text-sm md:text-base font-medium min-h-[2rem]",
      showBrand: false,
      showCategories: false,
      showDescription: false,
      showColors: false,
      showSizes: false,
      showDetailedPrice: false,
      showDeliveryInfo: false,
      showQuickView: false,
      buttonSize: "h-10 text-sm",
      maxBadges: 1,
    },
    detailed: {
      containerClass:
        "rounded-2xl hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-2",
      imageHeight: "h-56 md:h-64 lg:h-72",
      padding: "p-5 md:p-6",
      spacing: "space-y-3 md:space-y-4",
      titleSize: "text-base md:text-lg font-bold min-h-[3rem]",
      showBrand: true,
      showCategories: true,
      showDescription: true,
      showColors: true,
      showSizes: true,
      showDetailedPrice: true,
      showDeliveryInfo: true,
      showQuickView: true,
      buttonSize: "h-12 text-base",
      maxBadges: 4,
    },
    list: {
      containerClass:
        "flex flex-col sm:flex-row gap-4 sm:gap-4 rounded-xl hover:shadow-xl transition-all duration-300 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 border border-gray-200 dark:border-slate-800 sm:min-h-[15rem] sm:max-h-[16rem]",
      imageHeight: "h-40 sm:h-full sm:w-48 md:w-56 lg:w-56 flex-shrink-0",
      padding: "p-3 sm:py-4 sm:pr-4 sm:pl-5",
      spacing: "space-y-2 sm:space-y-2",
      titleSize: "text-lg sm:text-xl font-semibold leading-snug line-clamp-2",
      showBrand: true,
      showCategories: true,
      showDescription: true,
      showColors: true,
      showSizes: true,
      showDetailedPrice: false,
      showDeliveryInfo: false,
      showQuickView: false,
      buttonSize: "h-10 sm:h-11 text-sm",
      maxBadges: 3,
    },
  };

  const config = variantConfig[variant] || variantConfig.featured;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { addItem, loading } = useCartStore.getState();
    if (loading) return;

    try {
      if (!p || !p._id) {
        throw new Error("Invalid product data");
      }

      // Pass both the product and the calculated discounted price
      // to ensure consistency in price calculations
      await addItem(
        {
          ...p,
          calculatedPrice: discountedPrice, // Pass the pre-calculated price
        },
        1
      );
      toast({
        title: "🛒 Added to Cart!",
        description: `${p.name} has been added to your cart`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
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
          title: "Please Sign In",
          description: "You need to be signed in to save items to wishlist",
          variant: "destructive",
        });
        return;
      }

      await addItem(p);
      setIsInWishlistLocal(!isInWishlistLocal);
      toast({
        title: isInWishlistLocal
          ? "💔 Removed from Wishlist"
          : "💖 Added to Wishlist",
        description: `${p.name} ${
          isInWishlistLocal ? "removed from" : "added to"
        } your wishlist`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update wishlist",
      });
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view functionality
  };

  // Render badges based on variant
  const renderBadges = () => {
    const badges = [];

    if (isNew)
      badges.push({
        type: "new",
        component: (
          <Badge
            key="new"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-2 py-1 shadow-lg rounded-full"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        ),
      });

    if (isSale)
      badges.push({
        type: "sale",
        component: (
          <Badge
            key="sale"
            className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-2 py-1 shadow-lg rounded-full"
          >
            <Zap className="w-3 h-3 mr-1" />
            {discountPercentage}% OFF
          </Badge>
        ),
      });

    if (isBestseller)
      badges.push({
        type: "bestseller",
        component: (
          <Badge
            key="bestseller"
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-2 py-1 shadow-lg rounded-full"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            BESTSELLER
          </Badge>
        ),
      });

    return badges.slice(0, config.maxBadges).map((badge) => badge.component);
  };

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-700 hover:border-blue-200 dark:hover:border-blue-600/40 backdrop-blur-sm will-change-transform ${
        config.containerClass
      } ${variant === "list" ? "sm:flex-row" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 dark:from-blue-950/10 dark:to-purple-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Status badges */}
      <div className="absolute top-2 left-2 z-30 flex flex-col gap-1">
        {renderBadges()}
      </div>

      {/* Wishlist button - conditional visibility based on variant */}
      {(variant !== "compact" || isMobile) && (
        <div className="absolute top-2 right-2 z-30">
          <Button
            size="icon"
            variant="secondary"
            className={`h-8 w-8 md:h-9 md:w-9 rounded-full backdrop-blur-xl border shadow-lg transition-all duration-300 ${
              isInWishlistLocal
                ? "bg-red-500 hover:bg-red-600 text-white border-red-400 scale-110"
                : "bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 border-white/50 hover:scale-110"
            } ${
              isMobile || isHovered || variant === "hero"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
            }`}
            onClick={handleAddToWishlist}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-200 ${
                isInWishlistLocal ? "fill-current" : ""
              }`}
            />
          </Button>
        </div>
      )}

      {/* Product image with wrapper for list view */}
      <Link
        href={`/products/${p.slug || p._id}`}
        className={`block ${
          variant === "list"
            ? "sm:flex-shrink-0 sm:min-w-[12rem] md:min-w-[14rem]"
            : ""
        }`}
      >
        <div
          className={`relative ${
            config.imageHeight
          } bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 overflow-hidden ${
            variant === "list"
              ? "rounded-xl sm:rounded-l-xl sm:rounded-r-none sm:shadow-md dark:sm:shadow-slate-900/30"
              : "rounded-t-xl"
          }`}
        >
          {/* Loading skeleton */}
          {imageLoading && (
            <div className="absolute inset-0">
              <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse" />
            </div>
          )}

          <ImageWithFallback
            src={p.mainImage || p.images?.[0]}
            alt={p.name || "Product image"}
            fill
            sizes={
              variant === "list"
                ? "(max-width: 640px) 100vw, (max-width: 768px) 224px, 256px"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            }
            className={`transition-all duration-700 group-hover:scale-110 ${
              variant === "list"
                ? "object-cover object-center !h-full !w-full"
                : "object-contain p-2 md:p-3"
            }`}
            onLoad={() => setImageLoading(false)}
          />

          {/* Quick view overlay - only for supported variants */}
          {config.showQuickView && (
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center transition-all duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                size="icon"
                variant="secondary"
                className="h-12 w-12 rounded-full backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110 shadow-2xl border-2 border-white/50"
                onClick={handleQuickView}
              >
                <Eye className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Button>
            </div>
          )}

          {/* Stock indicator */}
          {isLowStock && variant !== "compact" && (
            <div className="absolute bottom-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm">
              <Clock className="w-3 h-3 mr-1 inline" />
              Only {p.stock} left!
            </div>
          )}
        </div>
      </Link>

      {/* Product info section */}
      <div
        className={`${config.padding} ${config.spacing} ${
          variant === "list"
            ? "sm:flex-1 sm:flex sm:flex-col sm:justify-between sm:h-full sm:overflow-hidden"
            : ""
        }`}
      >
        {/* Brand and categories - conditional */}
        {(config.showBrand || config.showCategories) && (
          <div className="flex items-center justify-between flex-wrap gap-2">
            {config.showBrand && p.brand && (
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/30">
                {p.brand}
              </span>
            )}
            {config.showCategories &&
              p.categories &&
              p.categories.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {p.categories.slice(0, 2).map((category, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs px-2 py-0.5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-full capitalize"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* Product title */}
        <Link href={`/products/${p.slug || p._id}`} className="block">
          <h3
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-tight text-gray-900 dark:text-white ${
              config.titleSize
            } ${variant === "list" ? "sm:text-xl sm:font-semibold" : ""}`}
          >
            {p.name}
          </h3>
        </Link>

        {/* Description - only for detailed variants */}
        {config.showDescription && p.description && (
          <p
            className={`text-sm text-gray-600 dark:text-gray-400 ${
              variant === "list"
                ? "line-clamp-2 sm:line-clamp-3 sm:my-2"
                : "line-clamp-2"
            }`}
          >
            {p.description}
          </p>
        )}

        {/* Rating and stock - simplified for compact */}
        <div
          className={`flex items-center justify-between flex-wrap gap-2 ${
            variant === "list" ? "sm:mt-1" : ""
          }`}
        >
          <div
            className={`flex items-center ${
              variant === "compact"
                ? "bg-transparent px-0 py-0 border-0"
                : variant === "list"
                ? "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-full px-2 py-1 border border-amber-100 dark:border-amber-900/30"
                : "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-full px-2 py-1 border border-amber-100 dark:border-amber-900/30"
            }`}
          >
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`${
                    variant === "list" ? "h-3.5 w-3.5" : "h-3 w-3"
                  } ${
                    star <= Math.floor(p.rating || 0)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span
              className={`ml-1 ${
                variant === "list" ? "text-xs" : "text-xs"
              } text-amber-700 dark:text-amber-300 font-medium`}
            >
              {(p.rating || 0).toFixed(1)}
              {variant !== "compact" && ` (${p.numReviews || 0})`}
            </span>
          </div>

          {/* Stock status - simplified for compact */}
          {variant !== "compact" && !isOutOfStock && (
            <div
              className={`flex items-center text-emerald-600 dark:text-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 ${
                variant === "list" ? "px-3 py-1.5" : "px-2 py-1"
              } rounded-full border border-emerald-100 dark:border-emerald-900/30`}
            >
              <Check
                className={`${
                  variant === "list" ? "h-3.5 w-3.5" : "h-3 w-3"
                } mr-1`}
              />
              <span
                className={`${
                  variant === "list" ? "text-xs" : "text-xs"
                } font-medium`}
              >
                In Stock
              </span>
            </div>
          )}
        </div>

        {/* Price section */}
        <div
          className={
            variant === "compact"
              ? "space-y-1"
              : variant === "list"
              ? "flex-shrink-0 sm:mt-auto sm:pt-3 sm:pb-1"
              : "space-y-2 bg-gradient-to-br from-blue-50/50 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/10 p-3 rounded-xl border border-blue-100/50 dark:border-blue-900/30"
          }
        >
          <div
            className={`flex ${
              variant === "list"
                ? "sm:flex-row sm:items-center sm:justify-between"
                : "items-center"
            } gap-2`}
          >
            <span
              className={`font-bold text-gray-900 dark:text-white ${
                variant === "compact"
                  ? "text-lg"
                  : variant === "list"
                  ? "text-xl sm:text-2xl"
                  : "text-xl md:text-2xl"
              }`}
            >
              ₹{discountedPrice.toLocaleString("en-IN")}
            </span>

            {variant === "list" && isSale ? (
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm px-2 py-0.5 font-medium rounded-full">
                  {discountPercentage}% OFF
                </Badge>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                    M.R.P.:
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ) : (
              <>
                {isSale && (
                  <Badge
                    className={`bg-gradient-to-r from-red-500 to-rose-500 text-white ${
                      variant === "list"
                        ? "text-sm px-2 py-0.5"
                        : "text-xs px-1.5 py-0.5"
                    } font-medium rounded-full`}
                  >
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </>
            )}
          </div>

          {isSale && variant !== "list" && (
            <div className="flex gap-2 items-center">
              {variant !== "compact" && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  M.R.P.:
                </span>
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          {/* Detailed price info - only for supported variants */}
          {config.showDetailedPrice && isSale && (
            <>
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                You save: ₹{savings.toLocaleString("en-IN")}
              </div>
              <div className="bg-green-50/70 dark:bg-green-900/20 rounded-lg p-2 border border-green-100 dark:border-green-800/30">
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Price:</span> ₹
                  {originalPrice.toLocaleString("en-IN")} - {discountPercentage}
                  % =
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {" "}
                    ₹{discountedPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Delivery info - only for supported variants */}
          {config.showDeliveryInfo && (
            <div className="flex flex-col gap-1 pt-1 border-t border-blue-100/50 dark:border-blue-900/30">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Fast Delivery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3 w-3 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Secure Payment
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Colors - only for supported variants */}
        {config.showColors && p.colors && p.colors.length > 0 && (
          <div
            className={`flex items-center gap-2 flex-wrap ${
              variant === "list" ? "sm:inline-flex sm:mb-1" : ""
            }`}
          >
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Colors:
            </span>
            <div className="flex gap-1">
              {p.colors
                .slice(0, variant === "list" ? 4 : 4)
                .map((color, index) => (
                  <div
                    key={index}
                    className={`${
                      variant === "list" ? "w-4 h-4" : "w-5 h-5"
                    } rounded-full border-2 border-white dark:border-slate-700 shadow-sm hover:scale-110 transition-transform cursor-pointer`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              {p.colors.length > (variant === "list" ? 4 : 4) && (
                <div
                  className={`${
                    variant === "list" ? "w-4 h-4" : "w-5 h-5"
                  } rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-bold text-gray-500`}
                >
                  +{p.colors.length - (variant === "list" ? 4 : 4)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sizes - only for supported variants */}
        {config.showSizes && p.sizes && p.sizes.length > 0 && (
          <div
            className={`flex items-center gap-2 flex-wrap ${
              variant === "list" ? "sm:inline-flex sm:mb-2" : ""
            }`}
          >
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Sizes:
            </span>
            <div className="flex gap-1">
              {p.sizes
                .slice(0, variant === "list" ? 4 : 4)
                .map((size, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={`text-xs ${
                      variant === "list" ? "px-1.5 py-0.5" : "px-1.5 py-0.5"
                    } border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer`}
                  >
                    {size}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Add to cart button */}
        <Button
          onClick={handleAddToCart}
          className={`${
            variant === "list" ? "sm:w-auto sm:px-8 sm:mt-2" : "w-full"
          } rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${
            variant === "list" ? "sm:h-11 sm:text-sm" : config.buttonSize
          } ${
            !isOutOfStock
              ? `bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white hover:scale-[1.02] active:scale-[0.98] ${
                  variant === "list" ? "sm:hover:scale-105" : ""
                }`
              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
          disabled={isOutOfStock || useCartStore.getState().loading}
        >
          <ShoppingCart
            className={`${
              variant === "list" ? "sm:h-5 sm:w-5" : "h-4 w-4"
            } mr-2`}
          />
          {useCartStore.getState().loading
            ? "Adding..."
            : isOutOfStock
            ? "Out of Stock"
            : variant === "compact"
            ? "Add"
            : variant === "list"
            ? "Add to Cart"
            : "Add to Cart"}
        </Button>
      </div>

      {/* Premium hover glow effect */}
      <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-indigo-600/0 group-hover:from-blue-600/5 group-hover:via-purple-600/5 group-hover:to-indigo-600/5 transition-all duration-700 pointer-events-none" />
    </div>
  );
}
