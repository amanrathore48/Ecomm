"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ShoppingBag, Truck } from "lucide-react";
import useCartStore from "@/stores/zustand-cart";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCartStore();

  // Clear cart when component mounts to ensure it's empty after successful order
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // If no orderId provided, redirect to home
  useEffect(() => {
    if (!orderId) {
      router.push("/");
    }
  }, [orderId, router]);

  if (!orderId) {
    return null; // Will redirect in the effect
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="flex flex-col items-center mb-8">
        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-center">Order Confirmed!</h1>
        <p className="text-gray-500 mt-2 text-center">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order #{orderId}</CardTitle>
          <CardDescription>
            A confirmation email has been sent to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" /> Order Details
            </h3>
            <p className="text-sm text-gray-500">
              You can view your order details in your account dashboard.
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Truck className="h-5 w-5" /> Shipping Information
            </h3>
            <p className="text-sm text-gray-500">
              You'll receive shipping updates via email and on your account
              dashboard.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-gray-500">
              If you have any questions about your order, please contact our
              customer service team at{" "}
              <span className="font-medium">support@ecomm.com</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={`/profile/orders?highlight=${orderId}`}>
              View Order Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
