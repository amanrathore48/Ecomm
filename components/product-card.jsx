"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import useCartStore from "@/stores/zustand-cart";
import useWishlistStore from "@/stores/useWishlist";

export function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  // Default product if none is provided
  const defaultProduct = {
    _id: "default",
    name: "Product Name",
    price: 49.99,
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
    e.stopPropagation(); // Stop event from bubbling up to parent elements
    const { addItem, loading } = useCartStore.getState();
    if (loading) return;

    try {
      // Make sure we have the required product fields
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
    // Quick view functionality would be implemented here
  };

  // ImageWithFallback component will handle the fallback logic

  return (
    <div
      className="group relative bg-card border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {isNew && <Badge className="bg-primary text-white">New</Badge>}
        {isSale && <Badge variant="destructive">-{discountPercentage}%</Badge>}
      </div>

      {/* Product image with action buttons overlay */}
      <Link href={`/products/${p._id}`} className="block">
        <div className="relative h-60 bg-secondary/20">
          <ImageWithFallback
            src={p.mainImage || p.images || p.img}
            alt={p.name || "Product image"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Action buttons that appear on hover */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full h-10 w-10"
              onClick={handleQuickView}
            >
              <Eye className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className={`rounded-full h-10 w-10 ${
                isInWishlistLocal ? "bg-primary hover:bg-primary/90" : ""
              }`}
              onClick={handleAddToWishlist}
            >
              <Heart
                className={`h-5 w-5 ${isInWishlistLocal ? "fill-white" : ""}`}
              />
            </Button>
          </div>
        </div>
      </Link>

      {/* Product info */}
      <div className="p-4">
        <Link href={`/products/${p._id}`} className="block">
          <h3 className="font-medium text-lg hover:text-primary transition-colors line-clamp-2">
            {p.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center mt-2">
          <span className="text-lg font-bold">${salePrice.toFixed(2)}</span>
          {isSale && (
            <span className="ml-2 text-muted-foreground line-through text-sm">
              ${p.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mt-2">
          {p.categories &&
            p.categories.map((category, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
        </div>

        {/* Rating - use rating if available, otherwise show placeholder */}
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.floor(p.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : star - 0.5 <= (p.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-muted-foreground">
            ({p.reviews || 0})
          </span>
        </div>

        {/* Add to cart button */}
        <div className="mt-4">
          <Button
            onClick={handleAddToCart}
            className="w-full"
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
    </div>
  );
}
