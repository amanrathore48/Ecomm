"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import Image from "next/image";
import useCartStore from "@/stores/zustand-cart";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

export default function SideCart({ isOpen, onClose }) {
  const {
    items,
    loading,
    error,
    fetchCart,
    removeItem,
    updateQuantity,
    getTotal,
    getItemCount,
  } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchCart().catch((err) => {
        toast({
          variant: "destructive",
          description: "Failed to load cart items",
        });
      });
    }
  }, [isOpen, fetchCart, toast]);

  const handleRemoveItem = async (productId) => {
    try {
      await removeItem(productId);
      toast({
        description: "Item removed from cart",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to remove item",
      });
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update quantity",
      });
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-background shadow-xl transition-transform duration-300 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart
              <Badge variant="secondary">{getItemCount()}</Badge>
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Cart content */}
        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="bg-secondary/20 h-24 w-24 rounded"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-secondary/20 rounded w-3/4"></div>
                    <div className="h-4 bg-secondary/20 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">Failed to load cart items</p>
              <Button variant="outline" onClick={fetchCart} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Start shopping to add items to your cart
              </p>
              <Button asChild onClick={onClose}>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b pb-4">
                  <div className="h-24 w-24 bg-secondary/10 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium truncate pr-4">{item.name}</h3>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>

        {/* Footer with total and checkout */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
