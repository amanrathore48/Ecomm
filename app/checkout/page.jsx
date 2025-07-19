"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CreditCard,
  Truck,
  Package,
  Check,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

// Import useCartStore for real cart data
import useCartStore from "@/stores/zustand-cart";

// Form validation schema
const shippingFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  zipCode: z
    .string()
    .min(5, { message: "ZIP code must be at least 5 characters." }),
  country: z.string().min(2, { message: "Please select your country." }),
  shippingMethod: z.enum(["standard", "express"], {
    message: "Please select a shipping method.",
  }),
  paymentMethod: z.enum(["credit_card", "paypal", "razorpay"], {
    message: "Please select a payment method.",
  }),
});

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const { items, getTotal, clearCart } = useCartStore();
  const shipping = 5.99;
  const subtotal = getTotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      shippingMethod: "standard",
      paymentMethod: "razorpay", // Default to Razorpay
    },
  });

  // Initialize Razorpay payment
  const initializeRazorpayPayment = async (orderData) => {
    // Create order on the server
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Razorpay expects amount in smallest currency unit (paise)
          currency: "INR",
          items: items,
          shippingDetails: form.getValues(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const orderResponse = await response.json();
      setOrderId(orderResponse.orderId);

      // Open Razorpay payment form
      const options = {
        key:
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Lsb86CATOBV5aB", // Your key ID from .env
        amount: Math.round(total * 100),
        currency: "INR",
        name: "Ecomm Store",
        description: "Thank you for your purchase",
        order_id: orderResponse.razorpayOrderId,
        handler: function (response) {
          // Handle successful payment
          verifyPayment(response, orderResponse.orderId);
        },
        prefill: {
          name: `${form.getValues("firstName")} ${form.getValues("lastName")}`,
          email: form.getValues("email"),
          contact: form.getValues("phone"),
        },
        theme: {
          color: "#4F46E5", // Primary color
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            toast({
              title: "Payment Cancelled",
              description: "You have cancelled the payment process.",
              variant: "destructive",
            });
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  // Verify payment with the server
  const verifyPayment = async (paymentResponse, orderId) => {
    try {
      const response = await fetch("/api/orders/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: paymentResponse.razorpay_payment_id,
          orderId: paymentResponse.razorpay_order_id,
          signature: paymentResponse.razorpay_signature,
          orderDbId: orderId,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      // Payment verified successfully - redirect to confirmation page
      clearCart(); // Clear cart after successful payment
      router.push(`/checkout/confirmation?orderId=${orderId}`);
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast({
        variant: "destructive",
        title: "Payment Verification Failed",
        description:
          "There was an issue verifying your payment. Please contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (values) => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    // Check if cart is empty
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Cart",
        description: "Your cart is empty. Add products before checkout.",
      });
      router.push("/products");
      return;
    }

    // Check if user is signed in (only if not in dev mode)
    if (!session && process.env.NODE_ENV !== "development") {
      toast({
        variant: "destructive",
        title: "Sign in required",
        description: "Please sign in to complete your purchase.",
      });
      router.push("/login?redirect=checkout");
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle different payment methods
      if (values.paymentMethod === "razorpay") {
        await initializeRazorpayPayment(values);
      } else {
        // For other payment methods (e.g. credit_card, paypal)
        // This is where you'd integrate other payment gateways
        toast({
          title: "Payment Method Not Available",
          description: "Please select Razorpay as the payment method.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There was a problem processing your order. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  // This UI is only shown for non-Razorpay payments or if we don't redirect
  // For Razorpay payments, we redirect to the confirmation page
  if (orderCompleted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Completed!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been confirmed and will
            be shipped soon.
          </p>
          <p className="mb-8 text-primary font-medium">
            {orderId
              ? `Order #${orderId}`
              : "Your order has been placed successfully"}
          </p>
          <div className="space-y-4">
            <Button asChild size="lg">
              <Link href="/orders">View Order</Link>
            </Button>
            <div>
              <Button variant="outline" asChild size="lg">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              1
            </div>
            <div className="flex-1 h-1 mx-4 bg-primary"></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium">Shipping</span>
            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-lg p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {currentStep === 1 && (
                    <>
                      <h2 className="text-xl font-bold mb-4">
                        Shipping Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="john.doe@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(123) 456-7890"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Anytown" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="CA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP/Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="US">
                                    United States
                                  </SelectItem>
                                  <SelectItem value="CA">Canada</SelectItem>
                                  <SelectItem value="UK">
                                    United Kingdom
                                  </SelectItem>
                                  <SelectItem value="AU">Australia</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="shippingMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Shipping Method</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-3"
                              >
                                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                                  <RadioGroupItem
                                    value="standard"
                                    id="standard"
                                  />
                                  <div className="flex flex-1 justify-between items-center">
                                    <label
                                      htmlFor="standard"
                                      className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer"
                                    >
                                      <Truck className="h-4 w-4" /> Standard
                                      Shipping (3-5 days)
                                    </label>
                                    <span>$5.99</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                                  <RadioGroupItem
                                    value="express"
                                    id="express"
                                  />
                                  <div className="flex flex-1 justify-between items-center">
                                    <label
                                      htmlFor="express"
                                      className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer"
                                    >
                                      <Package className="h-4 w-4" /> Express
                                      Shipping (1-2 days)
                                    </label>
                                    <span>$12.99</span>
                                  </div>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Select Payment Method</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-3"
                              >
                                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50 bg-blue-50 border-blue-200">
                                  <RadioGroupItem
                                    value="razorpay"
                                    id="razorpay"
                                    defaultChecked
                                  />
                                  <div className="flex flex-1 justify-between items-center">
                                    <label
                                      htmlFor="razorpay"
                                      className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        className="text-blue-600"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M8.6 13.2l-5.6 8.8h4.8l4.8-8-4-0.8zM14.6 5.2c-1.333 0.8-2 2.133-2 4 0 2.8 2.4 3.733 2.4 3.733l4.8-8c-0.8 0-4.8 0-5.2 0.267z"
                                        />
                                      </svg>
                                      Razorpay (Recommended)
                                    </label>
                                    <div className="text-xs text-blue-600 font-medium">
                                      Secure Payment
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                                  <RadioGroupItem
                                    value="credit_card"
                                    id="credit_card"
                                  />
                                  <div className="flex flex-1 justify-between items-center">
                                    <label
                                      htmlFor="credit_card"
                                      className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer"
                                    >
                                      <CreditCard className="h-4 w-4" />{" "}
                                      Credit/Debit Card
                                    </label>
                                    <div className="flex gap-1">
                                      <img
                                        src="/payment-visa.svg"
                                        alt="Visa"
                                        className="h-6"
                                      />
                                      <img
                                        src="/payment-mastercard.svg"
                                        alt="Mastercard"
                                        className="h-6"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                                  <RadioGroupItem value="paypal" id="paypal" />
                                  <div className="flex flex-1 justify-between items-center">
                                    <label
                                      htmlFor="paypal"
                                      className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer"
                                    >
                                      <img
                                        src="/payment-paypal.svg"
                                        alt="PayPal"
                                        className="h-4"
                                      />{" "}
                                      PayPal
                                    </label>
                                  </div>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("paymentMethod") === "razorpay" && (
                        <div className="space-y-4 pt-4 border-t">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2 text-blue-700 mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 16v-4"></path>
                                <path d="M12 8h.01"></path>
                              </svg>
                              <h3 className="font-medium">Razorpay Payment</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              You'll be redirected to Razorpay's secure payment
                              platform to complete your purchase after clicking
                              "Place Order".
                            </p>
                          </div>
                        </div>
                      )}

                      {form.watch("paymentMethod") === "credit_card" && (
                        <div className="space-y-4 pt-4 border-t">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Card Number
                            </label>
                            <Input placeholder="1234 5678 9012 3456" />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                              <label className="block text-sm font-medium mb-1">
                                Expiration Date
                              </label>
                              <Input placeholder="MM/YY" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                CVC
                              </label>
                              <Input placeholder="123" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Name on Card
                            </label>
                            <Input placeholder="John Doe" />
                          </div>
                        </div>
                      )}

                      <div className="pt-6 border-t">
                        <h3 className="font-medium mb-2">Billing Address</h3>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="same-address"
                            className="rounded"
                            defaultChecked
                          />
                          <label htmlFor="same-address" className="text-sm">
                            Same as shipping address
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between pt-6">
                    {currentStep === 1 ? (
                      <Button type="button" variant="outline" asChild>
                        <Link href="/cart">
                          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                      </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Processing..."
                        : currentStep === 1
                        ? "Continue to Payment"
                        : form.watch("paymentMethod") === "razorpay"
                        ? "Pay with Razorpay"
                        : "Place Order"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-4">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 rounded bg-secondary/20 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder-image.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <Button variant="outline" className="mt-2" asChild>
                      <Link href="/products">Shop Now</Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-md p-3 text-sm flex items-start space-x-2">
                <div className="text-primary">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <p>
                  By placing your order, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
