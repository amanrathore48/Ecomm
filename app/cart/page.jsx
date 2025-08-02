"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  Tag,
  ArrowLeft,
  CheckCircle,
  Gift,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import useCartStore from "@/stores/zustand-cart";
import { formatPrice } from "@/lib/currency";

export default function CartPage() {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  // Use the Zustand cart store
  const {
    items: cartItems,
    loading,
    updateQuantity: updateCartQuantity,
    removeItem: removeCartItem,
  } = useCartStore();

  // Handle updating item quantity with optimistic updates
  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await updateCartQuantity(id, newQuantity);
      toast({
        title: "✅ Cart Updated",
        description: "Item quantity updated successfully",
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ Update Failed",
        description: "Failed to update cart. Please try again.",
      });
    }
  };

  // Handle removing item from cart with confirmation
  const handleRemoveItem = async (id, itemName) => {
    try {
      await removeCartItem(id);
      toast({
        title: "🗑️ Item Removed",
        description: `${itemName} has been removed from your cart`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ Removal Failed",
        description: "Failed to remove item. Please try again.",
      });
    }
  };

  // Enhanced coupon application
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code",
      });
      return;
    }

    setIsApplyingCoupon(true);

    // Simulate API call
    setTimeout(() => {
      // Mock coupon validation
      const mockCoupons = {
        SAVE10: {
          discount: 10,
          type: "percentage",
          description: "10% off your order",
        },
        FLAT50: {
          discount: 50,
          type: "fixed",
          description: "₹50 off your order",
        },
        WELCOME: {
          discount: 15,
          type: "percentage",
          description: "Welcome! 15% off",
        },
      };

      const coupon = mockCoupons[couponCode.toUpperCase()];

      if (coupon) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
        toast({
          title: "🎉 Coupon Applied!",
          description: `${coupon.description} has been applied to your order`,
          duration: 4000,
        });
        setCouponCode("");
      } else {
        toast({
          variant: "destructive",
          title: "❌ Invalid Coupon",
          description: "This coupon code is not valid or has expired",
        });
      }

      setIsApplyingCoupon(false);
    }, 1000);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon Removed",
      description: "Coupon discount has been removed from your order",
    });
  };

  // Enhanced calculations with coupon
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate the total savings from all discounted items
  const discountSavings = cartItems.reduce(
    (total, item) =>
      total +
      (item.originalPrice && item.discount > 0
        ? (item.originalPrice - item.price) * item.quantity
        : 0),
    0
  );

  const shipping = subtotal > 1000 ? 0 : subtotal > 0 ? 49 : 0;
  const freeShippingThreshold = 1000;
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );

  let couponDiscount = 0;
  if (appliedCoupon) {
    couponDiscount =
      appliedCoupon.type === "percentage"
        ? (subtotal * appliedCoupon.discount) / 100
        : appliedCoupon.discount;
  }

  const total = Math.max(0, subtotal + shipping - couponDiscount);
  const savings = couponDiscount + discountSavings;

  // Enhanced loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/20">
        <div className="w-full max-w-6xl mx-auto px-2 xxs:px-3 xs:px-4 sm:px-6 py-2 xxs:py-4 xs:py-6 sm:py-8 md:py-12">
          <div className="animate-pulse space-y-4 xxs:space-y-6 xs:space-y-8">
            <div className="h-6 xxs:h-7 xs:h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-48 xxs:w-56 xs:w-64"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 xxs:gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-3 xxs:space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-lg xxs:rounded-xl xs:rounded-2xl sm:rounded-3xl p-2 xxs:p-3 xs:p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex space-x-2 xxs:space-x-3 xs:space-x-4">
                      <div className="h-16 w-16 xxs:h-18 xxs:w-18 xs:h-20 xs:w-20 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0"></div>
                      <div className="flex-1 space-y-2 xxs:space-y-3">
                        <div className="h-3 xxs:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-2 xxs:h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg xxs:rounded-xl xs:rounded-2xl sm:rounded-3xl p-3 xxs:p-4 xs:p-5 sm:p-6 md:p-8 h-fit border border-gray-100 dark:border-gray-700">
                <div className="space-y-3 xxs:space-y-4">
                  <div className="h-5 xxs:h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 xxs:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 xxs:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-10 xxs:h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/20">
        <div className="w-full max-w-4xl mx-auto px-2 xxs:px-3 xs:px-4 sm:px-6 py-4 xxs:py-6 xs:py-8 sm:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative mb-6 xxs:mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl rounded-full"></div>
              <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-24 h-24 xxs:w-28 xxs:h-28 xs:w-32 xs:h-32 mx-auto rounded-full flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50">
                <ShoppingBag className="h-12 w-12 xxs:h-14 xxs:w-14 xs:h-16 xs:w-16 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-2xl xxs:text-3xl xs:text-4xl font-bold mb-3 xxs:mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Your cart is empty
            </h1>
            <p className="text-base xxs:text-lg xs:text-xl text-gray-600 dark:text-gray-400 mb-6 xxs:mb-8 leading-relaxed px-2">
              Discover amazing products and start building your perfect
              collection
            </p>
            <div className="flex flex-col xxs:flex-col xs:flex-col sm:flex-row gap-3 xxs:gap-4 justify-center px-2">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-6 xxs:px-8 py-3 xxs:py-4 rounded-xl text-base xxs:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/products">
                  <ShoppingCart className="mr-2 h-4 w-4 xxs:h-5 xxs:w-5" />
                  Start Shopping
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6 xxs:px-8 py-3 xxs:py-4 rounded-xl text-base xxs:text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                asChild
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4 xxs:h-5 xxs:w-5" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/20">
      <div className="w-full max-w-6xl mx-auto px-2 xxs:px-3 xs:px-4 sm:px-6 py-4 xxs:py-6 xs:py-8 sm:py-12 md:py-16">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 xxs:mb-8 gap-3 xxs:gap-4">
          <div>
            <h1 className="text-2xl xxs:text-3xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1 xxs:mb-2">
              Shopping Cart
            </h1>
            <p className="text-sm xxs:text-base text-gray-600 dark:text-gray-400">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 text-sm xxs:text-base px-3 xxs:px-4 py-2 xxs:py-2.5"
            asChild
          >
            <Link href="/products">
              <ArrowLeft className="mr-1 xxs:mr-2 h-3 w-3 xxs:h-4 xxs:w-4" />
              <span className="hidden xxs:inline">Continue Shopping</span>
              <span className="xxs:hidden">Continue</span>
            </Link>
          </Button>
        </div>

        {/* Free Shipping Progress */}
        {remainingForFreeShipping > 0 && (
          <div className="mb-6 xxs:mb-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/30 rounded-xl xxs:rounded-2xl p-3 xxs:p-4 xs:p-5 sm:p-6">
            <div className="flex items-center gap-2 xxs:gap-3 mb-2 xxs:mb-3">
              <Truck className="h-4 w-4 xxs:h-5 xxs:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="font-semibold text-green-800 dark:text-green-300 text-sm xxs:text-base">
                <span className="hidden xs:inline">
                  Add ₹{remainingForFreeShipping.toLocaleString()} more for FREE
                  shipping!
                </span>
                <span className="xs:hidden">
                  ₹{remainingForFreeShipping.toLocaleString()} more for FREE
                  shipping!
                </span>
              </span>
            </div>
            <div className="w-full bg-green-200 dark:bg-green-900/40 rounded-full h-1.5 xxs:h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 xxs:h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (subtotal / freeShippingThreshold) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xxs:gap-6 xs:gap-6 sm:gap-8">
          {/* Enhanced Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl xxs:rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg backdrop-blur-sm overflow-hidden">
              {/* Desktop header - hidden on mobile */}
              <div className="hidden md:grid grid-cols-12 p-4 xxs:p-5 xs:p-6 pb-3 xxs:pb-4 border-b border-gray-100 dark:border-gray-800 text-xs xxs:text-sm uppercase font-bold text-gray-600 dark:text-gray-400 tracking-wide">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>

              <div className="p-3 xxs:p-4 xs:p-5 sm:p-6 pt-2 xxs:pt-3 xs:pt-4 md:pt-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`group grid grid-cols-1 md:grid-cols-12 gap-3 xxs:gap-4 py-4 xxs:py-5 xs:py-6 items-center transition-all duration-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 rounded-lg xxs:rounded-xl px-2 xxs:px-3 xs:px-4 ${
                      index !== cartItems.length - 1
                        ? "border-b border-gray-100 dark:border-gray-800"
                        : ""
                    }`}
                  >
                    {/* Product Info */}
                    <div className="md:col-span-6 flex items-center space-x-3 xxs:space-x-4">
                      <div className="relative h-16 w-16 xxs:h-18 xxs:w-18 xs:h-20 xs:w-20 md:h-22 md:w-22 lg:h-24 lg:w-24 rounded-lg xxs:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden group-hover:shadow-lg transition-all duration-300 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm xxs:text-base xs:text-lg mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <p className="text-xs xxs:text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {item.variant}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 xxs:gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg px-2 xxs:px-3 py-1 xxs:py-1.5 transition-all duration-200 text-xs xxs:text-sm"
                          >
                            <Trash2 className="h-3 w-3 xxs:h-4 xxs:w-4 mr-1" />
                            <span className="hidden xxs:inline">Remove</span>
                            <span className="xxs:hidden">Del</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-pink-500 hover:text-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg px-2 xxs:px-3 py-1 xxs:py-1.5 transition-all duration-200 text-xs xxs:text-sm"
                          >
                            <Heart className="h-3 w-3 xxs:h-4 xxs:w-4 mr-1" />
                            <span className="hidden xs:inline">
                              Save for Later
                            </span>
                            <span className="xs:hidden">Save</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Price - Mobile */}
                    <div className="md:hidden flex justify-between items-center">
                      <span className="text-xs xxs:text-sm font-medium text-gray-600 dark:text-gray-400">
                        Price:
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-base xxs:text-lg font-bold text-gray-900 dark:text-white">
                          {formatPrice(item.price)}
                        </span>
                        {item.discount > 0 && item.originalPrice && (
                          <span className="text-xs xxs:text-sm line-through text-gray-500 dark:text-gray-400">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price - Desktop */}
                    <div className="hidden md:block md:col-span-2 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatPrice(item.price)}
                        </span>
                        {item.discount > 0 && item.originalPrice && (
                          <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                        {item.discount > 0 && (
                          <Badge className="mt-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs">
                            {item.discount}% OFF
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                      <span className="md:hidden text-xs xxs:text-sm font-medium text-gray-600 dark:text-gray-400">
                        Quantity:
                      </span>
                      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg xxs:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 xxs:h-9 xxs:w-9 xs:h-10 xs:w-10 rounded-l-lg xxs:rounded-l-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3 xxs:h-4 xxs:w-4" />
                        </Button>
                        <span className="w-8 xxs:w-10 xs:w-12 text-center font-bold text-sm xxs:text-base text-gray-900 dark:text-white bg-white dark:bg-gray-900 border-x border-gray-200 dark:border-gray-700">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 xxs:h-9 xxs:w-9 xs:h-10 xs:w-10 rounded-r-lg xxs:rounded-r-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3 xxs:h-4 xxs:w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Total - Mobile */}
                    <div className="md:hidden flex justify-between items-center">
                      <span className="text-xs xxs:text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total:
                      </span>
                      <span className="text-lg xxs:text-xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Total - Desktop */}
                    <div className="hidden md:block md:col-span-2 text-center">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl xxs:rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg backdrop-blur-sm sticky top-4 xxs:top-6 xs:top-8">
              <div className="p-4 xxs:p-5 xs:p-6">
                <h2 className="text-xl xxs:text-2xl font-bold mb-4 xxs:mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Order Summary
                </h2>

                {/* Pricing Breakdown */}
                <div className="space-y-3 xxs:space-y-4 mb-4 xxs:mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm xxs:text-base">
                      <span className="hidden xs:inline">
                        Subtotal ({cartItems.length} items)
                      </span>
                      <span className="xs:hidden">
                        Subtotal ({cartItems.length})
                      </span>
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm xxs:text-base">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {discountSavings > 0 && (
                    <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                      <div className="flex items-center gap-1 xxs:gap-2">
                        <Tag className="h-3 w-3 xxs:h-4 xxs:w-4 flex-shrink-0" />
                        <span className="text-sm xxs:text-base">
                          <span className="hidden xs:inline">
                            Product Discounts
                          </span>
                          <span className="xs:hidden">Discounts</span>
                        </span>
                      </div>
                      <span className="font-semibold text-sm xxs:text-base">
                        -{formatPrice(discountSavings)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 xxs:gap-2">
                      <Truck className="h-3 w-3 xxs:h-4 xxs:w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 text-sm xxs:text-base">
                        Shipping
                        {shipping === 0 && (
                          <Badge className="ml-1 xxs:ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                            FREE
                          </Badge>
                        )}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm xxs:text-base">
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                      <div className="flex items-center gap-1 xxs:gap-2">
                        <Tag className="h-3 w-3 xxs:h-4 xxs:w-4 flex-shrink-0" />
                        <span className="text-sm xxs:text-base">
                          Coupon ({appliedCoupon.code})
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="h-5 w-5 xxs:h-6 xxs:w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 ml-1"
                        >
                          ×
                        </Button>
                      </div>
                      <span className="font-semibold text-sm xxs:text-base">
                        -{formatPrice(couponDiscount)}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 xxs:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-base xxs:text-lg font-bold text-gray-900 dark:text-white">
                        Total
                      </span>
                      <div className="text-right">
                        <span className="text-xl xxs:text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {formatPrice(total)}
                        </span>
                        {savings > 0 && (
                          <div className="text-xs xxs:text-sm text-green-600 dark:text-green-400 font-medium">
                            You save {formatPrice(savings)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg xxs:rounded-xl p-3 xxs:p-4 mb-4 xxs:mb-6 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center gap-2 xxs:gap-3 mb-2 xxs:mb-3">
                    <Shield className="h-4 w-4 xxs:h-5 xxs:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm xxs:text-base">
                      <span className="hidden xs:inline">Security & Trust</span>
                      <span className="xs:hidden">Security</span>
                    </span>
                  </div>
                  <div className="space-y-1.5 xxs:space-y-2 text-xs xxs:text-sm text-blue-700 dark:text-blue-300">
                    <div className="flex items-center gap-1.5 xxs:gap-2">
                      <CheckCircle className="h-3 w-3 xxs:h-4 xxs:w-4 flex-shrink-0" />
                      <span>256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-1.5 xxs:gap-2">
                      <CheckCircle className="h-3 w-3 xxs:h-4 xxs:w-4 flex-shrink-0" />
                      <span>100% secure payments</span>
                    </div>
                    <div className="flex items-center gap-1.5 xxs:gap-2">
                      <CheckCircle className="h-3 w-3 xxs:h-4 xxs:w-4 flex-shrink-0" />
                      <span>30-day return policy</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Coupon Section */}
                {!appliedCoupon && (
                  <div className="space-y-2 xxs:space-y-3 mb-4 xxs:mb-6">
                    <div className="flex items-center gap-1.5 xxs:gap-2 mb-1 xxs:mb-2">
                      <Gift className="h-3 w-3 xxs:h-4 xxs:w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm xxs:text-base">
                        Have a coupon?
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        className="rounded-lg xxs:rounded-xl border-2 focus:border-blue-500 dark:focus:border-blue-400 text-sm xxs:text-base h-9 xxs:h-10"
                        onKeyPress={(e) => e.key === "Enter" && applyCoupon()}
                      />
                      <Button
                        variant="outline"
                        onClick={applyCoupon}
                        disabled={isApplyingCoupon}
                        className="rounded-lg xxs:rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 px-3 xxs:px-4 text-sm xxs:text-base h-9 xxs:h-10 flex-shrink-0"
                      >
                        {isApplyingCoupon ? (
                          <div className="animate-spin h-3 w-3 xxs:h-4 xxs:w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Try: SAVE10, FLAT50, WELCOME
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 xxs:space-y-3">
                  <Button
                    className="w-full h-12 xxs:h-14 rounded-xl font-bold text-base xxs:text-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    size="lg"
                    asChild
                  >
                    <Link href="/checkout">
                      <Zap className="mr-1.5 xxs:mr-2 h-4 w-4 xxs:h-5 xxs:w-5" />
                      <span className="hidden xs:inline">
                        Proceed to Checkout
                      </span>
                      <span className="xs:hidden">Checkout</span>
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-10 xxs:h-12 rounded-xl font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 text-sm xxs:text-base"
                    size="lg"
                    asChild
                  >
                    <Link href="/products">
                      <ShoppingCart className="mr-1.5 xxs:mr-2 h-3 w-3 xxs:h-4 xxs:w-4" />
                      <span className="hidden xs:inline">
                        Continue Shopping
                      </span>
                      <span className="xs:hidden">Continue</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
