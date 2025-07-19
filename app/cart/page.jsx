"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import useCartStore from "@/stores/zustand-cart";

export default function CartPage() {
  const [couponCode, setCouponCode] = useState("");
  const { toast } = useToast();
  const { data: session } = useSession();

  // Use the Zustand cart store
  const {
    items: cartItems,
    loading,
    updateQuantity: updateCartQuantity,
    removeItem: removeCartItem,
  } = useCartStore();

  // Handle updating item quantity
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      updateCartQuantity(id, newQuantity);
      toast({
        description: "Cart updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update cart",
      });
    }
  };

  // Handle removing item from cart
  const handleRemoveItem = (id) => {
    try {
      removeCartItem(id);
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

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        variant: "destructive",
        description: "Please enter a coupon code",
      });
      return;
    }

    toast({
      description: "Coupon code applied successfully",
    });
    // In a real app, you would validate the coupon code with your API
  };

  // Calculate cart totals using cart items
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

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

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <div className="grid grid-cols-12 pb-4 mb-4 border-b text-sm uppercase font-medium text-muted-foreground">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 py-4 items-center border-b last:border-0 last:pb-0"
                >
                  <div className="col-span-6 flex items-center space-x-4">
                    <div className="relative h-20 w-20 rounded bg-secondary/20">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-sm flex items-center text-red-500 mt-1"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    ${item.price.toFixed(2)}
                  </div>

                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="pt-2 mt-2 border-t flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyCoupon}>
                    Apply
                  </Button>
                </div>

                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">Checkout</Link>
                </Button>

                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
