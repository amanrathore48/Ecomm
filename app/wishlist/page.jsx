"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

// Mock data for wishlist - will be replaced with actual data fetching
const mockWishlistItems = [
  {
    id: "1",
    name: "Wireless Bluetooth Earbuds",
    price: 79.99,
    image: "https://via.placeholder.com/200x200",
    inStock: true,
    category: "Electronics",
  },
  {
    id: "2",
    name: "Lightweight Running Shoes",
    price: 129.99,
    image: "https://via.placeholder.com/200x200",
    inStock: true,
    category: "Fashion",
  },
  {
    id: "3",
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    image: "https://via.placeholder.com/200x200",
    inStock: false,
    category: "Home & Kitchen",
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching wishlist data
    setTimeout(() => {
      setWishlistItems(mockWishlistItems);
      setLoading(false);
    }, 500);
  }, []);

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    toast({
      description: "Item removed from wishlist",
    });
  };

  const addToCart = (id) => {
    // In a real app, this would add the item to the cart
    toast({
      description: "Item added to cart",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-secondary rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-secondary rounded col-span-2"></div>
                <div className="h-2 bg-secondary rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-secondary rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8">
            Save items you love for future reference and inspiration.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Explore Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="relative border rounded-lg overflow-hidden bg-card group"
          >
            <div className="absolute top-3 right-3 z-10">
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFromWishlist(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="relative h-48 mb-4 bg-secondary/20 rounded-md">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{item.category}</Badge>
                  {!item.inStock && (
                    <Badge variant="secondary">Out of Stock</Badge>
                  )}
                </div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="font-semibold">${item.price.toFixed(2)}</p>
                <div className="pt-2">
                  <Button
                    className="w-full"
                    disabled={!item.inStock}
                    onClick={() => addToCart(item.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {item.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
