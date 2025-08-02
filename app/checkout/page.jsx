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
import { useTheme } from "next-themes";

import {
  Form,
  FormControl,
  FormDescription,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Truck,
  Package,
  Check,
  AlertTriangle,
  ArrowLeft,
  Home,
  Briefcase,
  MapPin,
  Plus,
  Shield,
  Clock,
  Star,
  Lock,
  Zap,
} from "lucide-react";

// Import useCartStore for real cart data
import useCartStore from "@/stores/zustand-cart";
import useGuestCartStore from "@/stores/useGuestCart";
import { formatPrice } from "@/lib/currency";
import { useAddress } from "@/helpers/useAddress";

// Form validation schema for address
const addressFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phoneNo: z
    .string()
    .min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  houseNo: z.string().min(1, { message: "House/flat no. is required." }),
  street: z.string().min(3, { message: "Street address is required." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  zipCode: z
    .string()
    .min(5, { message: "ZIP code must be at least 5 characters." }),
  country: z.string().min(2, { message: "Country is required." }),
  addressType: z.enum(["home", "work", "other"], {
    message: "Please select an address type.",
  }),
  isDefault: z.boolean().optional(),
});

// Form validation schema for checkout (payment related)
const checkoutFormSchema = z.object({
  shippingMethod: z.enum(["standard", "express"], {
    message: "Please select a shipping method.",
  }),
  paymentMethod: z.enum(["credit_card", "paypal", "razorpay"], {
    message: "Please select a payment method.",
  }),
  selectedAddressId: z
    .string()
    .min(1, { message: "Please select a delivery address." }),
});

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Log authentication status for debugging
  useEffect(() => {
    console.log("Auth Status:", { status, session: !!session });
  }, [status, session]);

  // Address management
  const {
    addresses,
    isLoading: addressLoading,
    fetchAddresses,
    addAddress,
  } = useAddress();

  // Cart management
  // Use guest cart for unauthenticated users, user cart for authenticated
  const guestCart = useGuestCartStore();
  const userCart = useCartStore();
  const isAuthenticated = !!session;
  const items = isAuthenticated ? userCart.items : guestCart.items;
  // Ensure getTotal is a function that can be called
  const getTotal = () =>
    isAuthenticated ? userCart.getTotal() : guestCart.getTotal();
  const clearCart = isAuthenticated ? userCart.clearCart : guestCart.clearCart;

  // On sign-in, merge guest cart with user cart and clear guest cart
  useEffect(() => {
    if (isAuthenticated && guestCart.items.length > 0) {
      // Merge guest cart into user cart
      guestCart.items.forEach((item) => {
        userCart.addItem(item);
      });
      guestCart.clearCart();
    }
  }, [isAuthenticated]);
  const shipping = { standard: 49, express: 149 }; // Shipping costs
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState("standard");

  useEffect(() => {
    // getTotal is now a function that returns the appropriate value
    const subtotalAmount = getTotal();
    setSubtotal(subtotalAmount);
    const taxAmount = Math.round(subtotalAmount * 0.18); // 18% GST
    setTax(taxAmount);
    setTotal(subtotalAmount + shipping[selectedShippingMethod] + taxAmount);
  }, [getTotal, shipping, selectedShippingMethod]);

  // Fetch addresses when session is available
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, fetchAddresses]);

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

  // Initialize checkout form
  const checkoutForm = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingMethod: "standard",
      paymentMethod: "razorpay",
      selectedAddressId: "",
    },
  });

  // Update shipping method when form field changes
  useEffect(() => {
    const subscription = checkoutForm.watch((value, { name }) => {
      if (name === "shippingMethod" && value.shippingMethod) {
        setSelectedShippingMethod(value.shippingMethod);
      }
      if (name === "selectedAddressId" && value.selectedAddressId) {
        setSelectedAddressId(value.selectedAddressId);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkoutForm]);

  // Initialize Razorpay payment
  const initializeRazorpayPayment = async (orderData) => {
    try {
      const selectedAddress = addresses.find(
        (addr) => addr._id === selectedAddressId
      );
      if (!selectedAddress) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a delivery address",
        });
        return;
      }

      // Create order on the server
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Razorpay expects amount in smallest currency unit (paise)
          currency: "INR",
          items: items,
          shippingDetails: {
            ...selectedAddress,
            shippingMethod: orderData.shippingMethod,
          },
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
          name: selectedAddress.name,
          email: selectedAddress.email,
          contact: selectedAddress.phoneNo,
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

  // Handle adding a new address
  const handleAddAddress = async (values) => {
    try {
      await addAddress(values);
      setIsAddressDialogOpen(false);
      toast({
        title: "Address Added",
        description: "Your address has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding address:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add address. Please try again.",
      });
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

    // Require sign-in for checkout (except in dev mode)
    console.log("Checkout Authentication Check:", {
      isAuthenticated,
      session: !!session,
      status,
      nodeEnv: process.env.NODE_ENV,
    });

    if (!isAuthenticated && process.env.NODE_ENV !== "development") {
      toast({
        variant: "destructive",
        title: "Sign in required",
        description: "Please sign in to complete your purchase.",
      });
      router.push("/signin?redirect=checkout");
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle different payment methods
      if (values.paymentMethod === "razorpay") {
        await initializeRazorpayPayment(values);
      } else {
        // For other payment methods (e.g. credit_card, paypal)
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 flex items-center justify-center px-2 xxs:px-3 xs:px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="relative mb-4 xxs:mb-6 xs:mb-8">
            <div className="absolute inset-0 bg-green-500/20 dark:bg-green-400/20 rounded-full animate-ping"></div>
            <div className="relative w-16 h-16 xxs:w-20 xxs:h-20 xs:w-24 xs:h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 flex items-center justify-center mx-auto shadow-2xl">
              <Check className="h-8 w-8 xxs:h-10 xxs:w-10 xs:h-12 xs:w-12 text-white" />
            </div>
          </div>
          <h1 className="text-2xl xxs:text-3xl xs:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2 xxs:mb-3 xs:mb-4">
            Order Completed!
          </h1>
          <p className="text-sm xxs:text-base xs:text-lg text-muted-foreground mb-4 xxs:mb-6 xs:mb-8 leading-relaxed px-2">
            Thank you for your purchase. Your order has been confirmed and will
            be shipped soon.
          </p>
          {orderId && (
            <div className="bg-background/80 backdrop-blur-sm border border-green-200 dark:border-green-900 rounded-xl xxs:rounded-2xl p-3 xxs:p-4 mb-4 xxs:mb-6 xs:mb-8 shadow-lg">
              <p className="text-green-700 dark:text-green-500 font-semibold text-sm xxs:text-base">
                Order #{orderId}
              </p>
            </div>
          )}
          <div className="space-y-2 xxs:space-y-3 xs:space-y-0 xs:flex xs:gap-3 xs:space-y-0">
            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 text-white shadow-xl h-10 xxs:h-11 xs:h-12 text-sm xxs:text-base"
            >
              <Link href="/orders">
                <Package className="mr-1.5 xxs:mr-2 h-4 w-4 xxs:h-5 xxs:w-5" />
                View Order
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              size="lg"
              className="w-full border-green-200 dark:border-green-900 text-green-700 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 h-10 xxs:h-11 xs:h-12 text-sm xxs:text-base"
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950/50 dark:via-blue-950/30 dark:to-indigo-950/30">
      <div className="w-full px-1 sm:px-4 py-1 sm:py-12">
        <div className="w-full mx-auto overflow-x-hidden">
          {/* Header */}
          <div className="text-center mb-3 xxs:mb-4 xs:mb-6 sm:mb-12">
            <h1 className="text-xl xxs:text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-300 dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent mb-1 xxs:mb-2 xs:mb-3 sm:mb-4">
              Secure Checkout
            </h1>
            <p className="text-muted-foreground text-xs xxs:text-sm xs:text-base sm:text-lg px-2">
              Complete your purchase securely and safely
            </p>
          </div>

          {/* Modern Progress Steps */}
          <div className="mb-4 xxs:mb-5 xs:mb-6 sm:mb-12">
            <div className="flex items-center justify-center max-w-xs xxs:max-w-sm xs:max-w-md mx-auto">
              <div className="flex items-center">
                <div
                  className={`relative flex items-center justify-center w-6 h-6 xxs:w-8 xxs:h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg xxs:rounded-xl sm:rounded-2xl transition-all duration-300 ${
                    currentStep >= 1
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > 1 ? (
                    <Check className="h-3 w-3 xxs:h-4 xxs:w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <span className="text-xs xxs:text-sm xs:text-base sm:text-lg">
                      1
                    </span>
                  )}
                  {currentStep === 1 && (
                    <div className="absolute inset-0 bg-blue-500/20 rounded-lg xxs:rounded-xl sm:rounded-2xl animate-pulse"></div>
                  )}
                </div>
                <div
                  className={`w-8 xxs:w-12 xs:w-16 sm:w-24 h-0.5 xxs:h-1 mx-1 xxs:mx-2 sm:mx-4 rounded-full transition-all duration-500 ${
                    currentStep >= 2
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                      : "bg-muted"
                  }`}
                ></div>
                <div
                  className={`relative flex items-center justify-center w-6 h-6 xxs:w-8 xxs:h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg xxs:rounded-xl sm:rounded-2xl transition-all duration-300 ${
                    currentStep >= 2
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > 2 ? (
                    <Check className="h-3 w-3 xxs:h-4 xxs:w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <span className="text-xs xxs:text-sm xs:text-base sm:text-lg">
                      2
                    </span>
                  )}
                  {currentStep === 2 && (
                    <div className="absolute inset-0 bg-blue-500/20 rounded-lg xxs:rounded-xl sm:rounded-2xl animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-1 xxs:mt-2 xs:mt-3 sm:mt-4 max-w-xs xxs:max-w-sm xs:max-w-md mx-auto px-1 xxs:px-2 sm:px-6">
              <span
                className={`text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm font-medium transition-colors ${
                  currentStep >= 1
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground"
                }`}
              >
                Delivery Details
              </span>
              <span
                className={`text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm font-medium transition-colors ${
                  currentStep >= 2
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground"
                }`}
              >
                Payment
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-1 xxs:gap-2 xs:gap-3 sm:gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-2">
              <div className="w-full max-w-2xl lg:max-w-3xl bg-background/80 backdrop-blur-xl border border-border rounded-lg xs:rounded-xl sm:rounded-3xl px-0 sm:px-6 py-1 sm:py-6 md:px-8 md:py-8 shadow-2xl shadow-black/5 mx-auto">
                <Form {...checkoutForm}>
                  <form
                    onSubmit={checkoutForm.handleSubmit(onSubmit)}
                    className="space-y-2 xxs:space-y-3 xs:space-y-4 sm:space-y-8"
                  >
                    {currentStep === 1 && (
                      <>
                        <div className="flex items-center gap-1 xxs:gap-1.5 xs:gap-2 sm:gap-3 mb-2 xxs:mb-3 xs:mb-4 sm:mb-6 px-2 xxs:px-4 xs:px-6 sm:px-8 pt-2 xxs:pt-3 xs:pt-4 sm:pt-6">
                          <div className="w-5 h-5 xxs:w-6 xxs:h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-md xxs:rounded-lg xs:rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-500 flex items-center justify-center">
                            <MapPin className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <h2 className="text-sm xxs:text-base xs:text-lg sm:text-2xl font-bold">
                            Delivery Address
                          </h2>
                        </div>

                        {/* Address Management */}
                        <FormField
                          control={checkoutForm.control}
                          name="selectedAddressId"
                          render={({ field }) => (
                            <FormItem className="space-y-2 xxs:space-y-3 xs:space-y-4 sm:space-y-6 px-2 xxs:px-4 xs:px-6 sm:px-8">
                              <FormLabel className="text-xs xxs:text-sm xs:text-base font-semibold">
                                Choose your delivery address
                              </FormLabel>
                              <FormControl>
                                <div className="space-y-2 xxs:space-y-3 xs:space-y-4">
                                  {addressLoading ? (
                                    <div className="text-center py-6 xxs:py-8 xs:py-10 sm:py-12 border-2 border-dashed border-border rounded-lg xxs:rounded-xl sm:rounded-2xl bg-muted/50">
                                      <div className="relative mx-auto w-8 h-8 xxs:w-10 xxs:h-10 xs:w-12 xs:h-12 mb-2 xxs:mb-3 xs:mb-4">
                                        <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-full animate-ping"></div>
                                        <div className="relative w-8 h-8 xxs:w-10 xxs:h-10 xs:w-12 xs:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-500 rounded-full flex items-center justify-center">
                                          <div className="w-4 h-4 xxs:w-5 xxs:h-5 xs:w-6 xs:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                      </div>
                                      <p className="font-semibold mb-1 xxs:mb-2 text-xs xxs:text-sm xs:text-base">
                                        Loading your saved addresses
                                      </p>
                                      <p className="text-muted-foreground text-[10px] xxs:text-xs xs:text-sm">
                                        Please wait while we retrieve your
                                        addresses
                                      </p>
                                    </div>
                                  ) : addresses && addresses.length > 0 ? (
                                    <div className="grid gap-2 xxs:gap-3 xs:gap-4">
                                      {addresses.map((address) => (
                                        <div
                                          key={address._id}
                                          className={`group relative border rounded-md xxs:rounded-lg xs:rounded-xl md:rounded-2xl p-1.5 xs:p-2 sm:p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                                            selectedAddressId === address._id
                                              ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5"
                                              : "border-border bg-card hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                                          }`}
                                          onClick={() => {
                                            setSelectedAddressId(address._id);
                                            checkoutForm.setValue(
                                              "selectedAddressId",
                                              address._id
                                            );
                                          }}
                                        >
                                          {selectedAddressId ===
                                            address._id && (
                                            <div className="absolute top-1 xxs:top-1.5 xs:top-2.5 sm:top-4 right-1 xxs:right-1.5 xs:right-2.5 sm:right-4 w-3 h-3 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                              <Check className="h-1.5 w-1.5 xxs:h-2 xxs:w-2 xs:h-3 xs:w-3 sm:h-4 sm:w-4 text-white" />
                                            </div>
                                          )}
                                          <div className="flex flex-wrap sm:flex-nowrap justify-between items-start">
                                            <div className="flex-1 min-w-0 pr-1 xxs:pr-2">
                                              <div className="font-semibold text-[10px] xxs:text-xs xs:text-sm sm:text-lg mb-0.5 xxs:mb-1 sm:mb-2">
                                                {address.name}
                                              </div>
                                              <div className="text-foreground/80 text-[9px] xxs:text-[10px] xs:text-xs sm:text-base leading-tight xxs:leading-relaxed mb-1 xxs:mb-1.5 xs:mb-2 sm:mb-3">
                                                {address.houseNo},{" "}
                                                {address.street}
                                                <br />
                                                {address.city}, {address.state}{" "}
                                                {address.zipCode}
                                                <br />
                                                {address.country}
                                              </div>
                                              <div className="text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-sm text-muted-foreground">
                                                <span className="font-medium">
                                                  Phone:
                                                </span>{" "}
                                                {address.phoneNo}
                                              </div>
                                            </div>
                                            <div className="flex flex-row sm:flex-col gap-0.5 xxs:gap-1 xs:gap-1.5 sm:gap-2 items-end mt-1 xxs:mt-1.5 xs:mt-2 sm:mt-0 w-full sm:w-auto">
                                              {address.isDefault && (
                                                <span className="px-1 xxs:px-1.5 xs:px-2 sm:px-3 py-0.5 text-[7px] xxs:text-[8px] xs:text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full">
                                                  Default
                                                </span>
                                              )}
                                              <span className="px-1 xxs:px-1.5 xs:px-2 sm:px-3 py-0.5 text-[7px] xxs:text-[8px] xs:text-[10px] font-medium bg-muted text-muted-foreground rounded-full capitalize">
                                                {address.addressType}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center border-2 border-dashed border-border rounded-lg xxs:rounded-xl sm:rounded-2xl p-2 xxs:p-3 xs:p-4 sm:p-8 md:p-12 bg-muted/50">
                                      <div className="w-8 h-8 xxs:w-10 xxs:h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600 rounded-md xxs:rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-1 xxs:mb-2 xs:mb-3 sm:mb-4">
                                        <MapPin className="h-3 w-3 xxs:h-4 xxs:w-4 xs:h-5 xs:w-5 sm:h-8 sm:w-8 text-white" />
                                      </div>
                                      <p className="font-semibold mb-0.5 xxs:mb-1 xs:mb-2 sm:mb-2 text-[10px] xxs:text-xs xs:text-sm sm:text-lg">
                                        No saved addresses found
                                      </p>
                                      <p className="text-muted-foreground mb-2 xxs:mb-3 xs:mb-4 sm:mb-6 text-[9px] xxs:text-[10px] xs:text-xs sm:text-base px-1">
                                        Please add a new delivery address to
                                        continue with your order
                                      </p>
                                      {!isAuthenticated && (
                                        <Button
                                          type="button"
                                          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg h-7 xxs:h-8 xs:h-9 text-[10px] xxs:text-xs px-2 xxs:px-3"
                                          onClick={() =>
                                            router.push(
                                              "/login?redirect=checkout"
                                            )
                                          }
                                        >
                                          Sign in to add address
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                  {isAuthenticated && (
                                    <Button
                                      type="button"
                                      variant={
                                        addresses && addresses.length === 0
                                          ? "default"
                                          : "outline"
                                      }
                                      className={`w-full mt-2 xxs:mt-3 xs:mt-4 sm:mt-6 rounded-md xxs:rounded-lg xs:rounded-xl sm:rounded-2xl text-[9px] xxs:text-[10px] xs:text-xs h-6 xxs:h-7 xs:h-8 sm:h-11 transition-all duration-300 ${
                                        addresses && addresses.length === 0
                                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                                          : "border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700"
                                      }`}
                                      onClick={() =>
                                        setIsAddressDialogOpen(true)
                                      }
                                    >
                                      <Plus className="mr-1 xxs:mr-1.5 xs:mr-2 h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-4 xs:w-4" />
                                      {addresses && addresses.length === 0
                                        ? "Add Your First Address"
                                        : "Add New Address"}
                                    </Button>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={checkoutForm.control}
                          name="shippingMethod"
                          render={({ field }) => (
                            <FormItem className="space-y-2 xxs:space-y-3 xs:space-y-4 sm:space-y-6 p-4 xxs:p-5 xs:p-6 sm:p-8 md:p-10 bg-card rounded-lg xxs:rounded-xl xs:rounded-2xl">
                              <FormLabel className="text-xs xxs:text-sm xs:text-base font-semibold">
                                Shipping Method
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="space-y-2 xxs:space-y-3 xs:space-y-4"
                                >
                                  <div className="relative border rounded-lg xxs:rounded-xl xs:rounded-2xl p-1 xxs:p-1.5 xs:p-2.5 sm:p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 bg-card">
                                    <RadioGroupItem
                                      value="standard"
                                      id="standard"
                                      className="absolute top-1 xxs:top-1.5 xs:top-2.5 sm:top-4 md:top-6 right-1 xxs:right-1.5 xs:right-2.5 sm:right-4 md:right-6"
                                    />
                                    <label
                                      htmlFor="standard"
                                      className="flex flex-col xs:flex-row items-start gap-1 xxs:gap-1.5 xs:gap-2 sm:gap-4 cursor-pointer"
                                    >
                                      <div className="w-6 h-6 xxs:w-7 xxs:h-7 xs:w-8 xs:h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-md xxs:rounded-lg xs:rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Truck className="h-3 w-3 xxs:h-3.5 xxs:w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                                      </div>
                                      <div className="flex-1 mt-0.5 xs:mt-0">
                                        <div className="font-semibold text-[10px] xxs:text-xs xs:text-sm sm:text-base mb-0.5 sm:mb-1">
                                          Standard Shipping
                                        </div>
                                        <div className="text-muted-foreground text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm mb-0.5 xxs:mb-1 sm:mb-2">
                                          Delivered in 3-5 business days
                                        </div>
                                        <div className="flex items-center gap-1 xxs:gap-1.5 sm:gap-2">
                                          <Clock className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                                          <span className="text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
                                            Free shipping on orders over ₹999
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-right mt-1 xxs:mt-1.5 xs:mt-2 sm:mt-0 flex-shrink-0">
                                        <div className="text-xs xxs:text-sm xs:text-base sm:text-lg md:text-xl font-bold">
                                          {formatPrice(shipping.standard)}
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                  <div className="relative border rounded-lg xxs:rounded-xl xs:rounded-2xl p-1 xxs:p-1.5 xs:p-2.5 sm:p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-400 bg-card">
                                    <RadioGroupItem
                                      value="express"
                                      id="express"
                                      className="absolute top-1 xxs:top-1.5 xs:top-2.5 sm:top-4 md:top-6 right-1 xxs:right-1.5 xs:right-2.5 sm:right-4 md:right-6"
                                    />
                                    <label
                                      htmlFor="express"
                                      className="flex flex-col xs:flex-row items-start gap-1 xxs:gap-1.5 xs:gap-2 sm:gap-4 cursor-pointer"
                                    >
                                      <div className="w-6 h-6 xxs:w-7 xxs:h-7 xs:w-8 xs:h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-md xxs:rounded-lg xs:rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Zap className="h-3 w-3 xxs:h-3.5 xxs:w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                                      </div>
                                      <div className="flex-1 mt-0.5 xs:mt-0">
                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                                          <span className="font-semibold text-[10px] xxs:text-xs xs:text-sm sm:text-base">
                                            Express Shipping
                                          </span>
                                          <span className="px-1 py-0.5 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[8px] xxs:text-[9px] xs:text-[10px] font-semibold rounded-full">
                                            FAST
                                          </span>
                                        </div>
                                        <div className="text-muted-foreground text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm mb-0.5 xxs:mb-1 sm:mb-2">
                                          Delivered in 1-2 business days
                                        </div>
                                        <div className="flex items-center gap-1 xxs:gap-1.5 sm:gap-2">
                                          <Package className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-muted-foreground/70" />
                                          <span className="text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
                                            Priority handling & tracking
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-right mt-1 xxs:mt-1.5 xs:mt-2 sm:mt-0 flex-shrink-0">
                                        <div className="text-xs xxs:text-sm xs:text-base sm:text-lg md:text-xl font-bold">
                                          {formatPrice(shipping.express)}
                                        </div>
                                      </div>
                                    </label>
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
                        <div className="flex items-center gap-1 xxs:gap-1.5 xs:gap-2 sm:gap-3 mb-2 xxs:mb-3 xs:mb-4 sm:mb-6">
                          <div className="w-5 h-5 xxs:w-6 xxs:h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-md xxs:rounded-lg xs:rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Lock className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <h2 className="text-sm xxs:text-base xs:text-lg sm:text-2xl font-bold">
                            Secure Payment
                          </h2>
                        </div>

                        <FormField
                          control={checkoutForm.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem className="space-y-2 xxs:space-y-3 xs:space-y-4 sm:space-y-6">
                              <FormLabel className="text-xs xxs:text-sm xs:text-base font-semibold">
                                Choose your payment method
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="space-y-2 xxs:space-y-3 xs:space-y-4"
                                >
                                  <div className="relative border rounded-lg xxs:rounded-xl xs:rounded-2xl p-1 xxs:p-1.5 xs:p-2.5 sm:p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800/40">
                                    <RadioGroupItem
                                      value="razorpay"
                                      id="razorpay"
                                      defaultChecked
                                      className="absolute top-1 xxs:top-1.5 xs:top-2.5 sm:top-4 md:top-6 right-1 xxs:right-1.5 xs:right-2.5 sm:right-4 md:right-6"
                                    />
                                    <label
                                      htmlFor="razorpay"
                                      className="flex flex-col xs:flex-row items-start gap-1 xxs:gap-1.5 xs:gap-2 sm:gap-4 cursor-pointer"
                                    >
                                      <div className="w-7 h-7 xxs:w-8 xxs:h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md xxs:rounded-lg xs:rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="14"
                                          height="14"
                                          viewBox="0 0 24 24"
                                          className="text-white xxs:w-4 xxs:h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
                                        >
                                          <path
                                            fill="currentColor"
                                            d="M8.6 13.2l-5.6 8.8h4.8l4.8-8-4-0.8zM14.6 5.2c-1.333 0.8-2 2.133-2 4 0 2.8 2.4 3.733 2.4 3.733l4.8-8c-0.8 0-4.8 0-5.2 0.267z"
                                          />
                                        </svg>
                                      </div>
                                      <div className="flex-1 mt-0.5 xs:mt-0">
                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                                          <span className="font-semibold text-[10px] xxs:text-xs xs:text-sm sm:text-base">
                                            Razorpay
                                          </span>
                                          <span className="px-1 xxs:px-1.5 md:px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 text-white text-[8px] xxs:text-[9px] xs:text-[10px] font-semibold rounded-full">
                                            RECOMMENDED
                                          </span>
                                        </div>
                                        <div className="text-muted-foreground text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm mb-0.5 xxs:mb-1 sm:mb-2">
                                          UPI, Cards, Wallets & Net Banking
                                        </div>
                                        <div className="flex items-center gap-1 xxs:gap-1.5 sm:gap-2">
                                          <Shield className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-green-500" />
                                          <span className="text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm text-green-600 dark:text-green-500 font-medium">
                                            256-bit SSL Encrypted
                                          </span>
                                        </div>
                                      </div>
                                    </label>
                                  </div>

                                  <div className="relative border rounded-lg xxs:rounded-xl xs:rounded-2xl p-1.5 xs:p-2 sm:p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-800 bg-card opacity-60 dark:opacity-40">
                                    <RadioGroupItem
                                      value="credit_card"
                                      id="credit_card"
                                      className="absolute top-1 xxs:top-1.5 xs:top-2.5 sm:top-4 md:top-6 right-1 xxs:right-1.5 xs:right-2.5 sm:right-4 md:right-6"
                                      disabled
                                    />
                                    <label
                                      htmlFor="credit_card"
                                      className="flex flex-col xs:flex-row items-start gap-1 xxs:gap-1.5 xs:gap-2 sm:gap-4 cursor-pointer"
                                    >
                                      <div className="w-7 h-7 xxs:w-8 xxs:h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-md xxs:rounded-lg xs:rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <CreditCard className="h-3 w-3 xxs:h-3.5 xxs:w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                                      </div>
                                      <div className="flex-1 mt-0.5 xs:mt-0">
                                        <div className="font-semibold text-[10px] xxs:text-xs xs:text-sm sm:text-base text-muted-foreground mb-0.5 sm:mb-1">
                                          Credit/Debit Card
                                        </div>
                                        <div className="text-muted-foreground/70 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm mb-0.5 xxs:mb-1 sm:mb-2">
                                          Direct card payment (Coming Soon)
                                        </div>
                                        <div className="flex gap-1 xxs:gap-1.5 sm:gap-2">
                                          <div className="w-5 h-3 xxs:w-6 xxs:h-3.5 xs:w-7 xs:h-4 md:w-8 md:h-5 bg-blue-600 rounded text-white text-[8px] xxs:text-[9px] xs:text-[10px] flex items-center justify-center font-bold">
                                            VISA
                                          </div>
                                          <div className="w-5 h-3 xxs:w-6 xxs:h-3.5 xs:w-7 xs:h-4 md:w-8 md:h-5 bg-red-500 rounded text-white text-[8px] xxs:text-[9px] xs:text-[10px] flex items-center justify-center font-bold">
                                            MC
                                          </div>
                                        </div>
                                      </div>
                                    </label>
                                  </div>

                                  <div className="relative border rounded-lg xxs:rounded-xl xs:rounded-2xl p-1 xxs:p-1.5 xs:p-2.5 sm:p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-800 bg-card opacity-60 dark:opacity-40">
                                    <RadioGroupItem
                                      value="paypal"
                                      id="paypal"
                                      className="absolute top-1 xxs:top-1.5 xs:top-2.5 sm:top-4 md:top-6 right-1 xxs:right-1.5 xs:right-2.5 sm:right-4 md:right-6"
                                      disabled
                                    />
                                    <label
                                      htmlFor="paypal"
                                      className="flex flex-col xs:flex-row items-start gap-1 xxs:gap-1.5 xs:gap-2 sm:gap-4 cursor-pointer"
                                    >
                                      <div className="w-7 h-7 xxs:w-8 xxs:h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md xxs:rounded-lg xs:rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <div className="text-white font-bold text-[10px] xxs:text-xs xs:text-sm">
                                          PP
                                        </div>
                                      </div>
                                      <div className="flex-1 mt-0.5 xs:mt-0">
                                        <div className="font-semibold text-[10px] xxs:text-xs xs:text-sm sm:text-base text-muted-foreground mb-0.5 sm:mb-1">
                                          PayPal
                                        </div>
                                        <div className="text-muted-foreground/70 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm">
                                          Pay with your PayPal account (Coming
                                          Soon)
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {checkoutForm.watch("paymentMethod") === "razorpay" && (
                          <div className="space-y-1 xxs:space-y-2 xs:space-y-3 pt-2 xxs:pt-3 xs:pt-4 sm:pt-6 border-t border-border">
                            <div className="p-1.5 xxs:p-2 xs:p-3 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg xxs:rounded-xl xs:rounded-2xl border border-blue-200 dark:border-blue-800/40">
                              <div className="flex items-start gap-1 xxs:gap-1.5 xs:gap-2 sm:gap-3 text-blue-700 dark:text-blue-400 mb-1.5 xxs:mb-2 xs:mb-3">
                                <div className="w-5 h-5 xxs:w-6 xxs:h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Shield className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-0.5 xxs:mb-1 text-[10px] xxs:text-xs xs:text-sm sm:text-base">
                                    Secure Payment with Razorpay
                                  </h3>
                                  <p className="text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                                    You'll be redirected to Razorpay's secure
                                    payment platform to complete your purchase.
                                    Your payment information is encrypted and
                                    protected with industry-standard security.
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 xxs:gap-2 xs:gap-3 sm:gap-4 pt-1 xxs:pt-1.5 xs:pt-2 border-t border-blue-200 dark:border-blue-800/40">
                                <div className="flex items-center gap-1 xxs:gap-1.5 sm:gap-2 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                                  <Shield className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
                                  <span>SSL Encrypted</span>
                                </div>
                                <div className="flex items-center gap-1 xxs:gap-1.5 sm:gap-2 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                                  <Star className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
                                  <span>Trusted by millions</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 xxs:pt-3 xs:pt-4 sm:pt-6 border-t border-border">
                          <h3 className="font-semibold mb-1.5 xxs:mb-2 xs:mb-3 sm:mb-4 flex items-center gap-1 xxs:gap-1.5 xs:gap-2 text-[10px] xxs:text-xs xs:text-sm sm:text-lg">
                            <MapPin className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                            Billing Address
                          </h3>
                          <div className="flex items-center space-x-1 xxs:space-x-1.5 xs:space-x-2 sm:space-x-3 p-1.5 xxs:p-2 xs:p-2.5 sm:p-4 bg-muted rounded-lg xxs:rounded-xl xs:rounded-2xl">
                            <input
                              type="checkbox"
                              id="same-address"
                              className="w-3 h-3 xxs:w-4 xxs:h-4 text-blue-600 bg-background border-input rounded focus:ring-blue-500"
                              defaultChecked
                            />
                            <label
                              htmlFor="same-address"
                              className="text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm"
                            >
                              Same as shipping address
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex flex-col xs:flex-row justify-between gap-1.5 xxs:gap-2 xs:gap-3 pt-2 xxs:pt-3 xs:pt-4 sm:pt-6 md:pt-8 border-t border-border">
                      {currentStep === 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          asChild
                          className="rounded-md xxs:rounded-lg xs:rounded-xl md:rounded-2xl border px-2 xxs:px-3 xs:px-4 md:px-6 h-6 xxs:h-7 xs:h-8 sm:h-10 md:h-11 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm w-full xs:w-auto order-2 xs:order-1"
                        >
                          <Link href="/cart">
                            <ArrowLeft className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 mr-0.5 xxs:mr-1 xs:mr-1.5 md:mr-2" />{" "}
                            Back to Cart
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="rounded-md xxs:rounded-lg xs:rounded-xl md:rounded-2xl border px-2 xxs:px-3 xs:px-4 md:px-6 h-6 xxs:h-7 xs:h-8 sm:h-10 md:h-11 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm w-full xs:w-auto order-2 xs:order-1"
                        >
                          <ArrowLeft className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 mr-0.5 xxs:mr-1 xs:mr-1.5 md:mr-2" />{" "}
                          Back
                        </Button>
                      )}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg rounded-md xxs:rounded-lg xs:rounded-xl md:rounded-2xl px-2 xxs:px-3 xs:px-4 md:px-8 h-6 xxs:h-7 xs:h-8 sm:h-10 md:h-11 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm min-w-[80px] xxs:min-w-[100px] xs:min-w-[120px] sm:min-w-[140px] md:min-w-[180px] w-full xs:w-auto order-1 xs:order-2"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-1 xxs:gap-1.5 xs:gap-2">
                            <div className="w-2.5 h-2.5 xxs:w-3 xxs:h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : currentStep === 1 ? (
                          <>Continue to Payment</>
                        ) : checkoutForm.watch("paymentMethod") ===
                          "razorpay" ? (
                          <>
                            <Lock className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 mr-1 xxs:mr-1.5 sm:mr-2" />
                            Pay Securely
                          </>
                        ) : (
                          <>Place Order</>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card/80 backdrop-blur-xl border border-border rounded-lg xxs:rounded-xl xs:rounded-2xl sm:rounded-3xl p-1 xxs:p-1.5 xs:p-2.5 sm:p-6 md:p-8 pt-2 xxs:pt-3 xs:pt-4 sm:pt-6 px-2 xxs:px-4 xs:px-6 sm:px-8 shadow-2xl shadow-black/5 sticky top-1 xxs:top-2 xs:top-4 sm:top-8">
                <div className="flex items-center gap-1 xxs:gap-1.5 xs:gap-2 sm:gap-3 mb-2 xxs:mb-3 xs:mb-4 sm:mb-6">
                  <div className="w-4 h-4 xxs:w-5 xxs:h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-md xxs:rounded-lg xs:rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 flex items-center justify-center">
                    <Package className="h-2 w-2 xxs:h-2.5 xxs:w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <h2 className="text-xs xxs:text-sm xs:text-base sm:text-xl font-bold">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-2 xxs:space-y-3 xs:space-y-4 mb-3 xxs:mb-4 xs:mb-5 sm:mb-6">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-1 xxs:gap-1.5 xs:gap-2.5 sm:gap-3 md:gap-4 p-1 xxs:p-1.5 xs:p-2 sm:p-3 md:p-4 rounded-md xxs:rounded-lg xs:rounded-xl md:rounded-2xl bg-muted/60 border border-border"
                      >
                        <div className="relative h-8 w-8 xxs:h-10 xxs:w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-md xxs:rounded-lg md:rounded-xl bg-card shadow-sm flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.image || "/placeholder-image.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute -top-0.5 -right-0.5 xxs:-top-1 xxs:-right-1 xs:-top-1.5 xs:-right-1.5 md:-top-2 md:-right-2 h-3 w-3 xxs:h-4 xxs:w-4 xs:h-5 xs:w-5 md:h-6 md:w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white flex items-center justify-center text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-xs font-semibold shadow-lg">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm font-semibold truncate">
                            {item.name}
                          </h3>
                          <p className="text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-sm text-muted-foreground mt-0.5">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                          <p className="text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm font-semibold mt-0.5">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 xxs:py-5 xs:py-6 sm:py-8">
                      <div className="w-10 h-10 xxs:w-12 xxs:h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-muted rounded-lg xxs:rounded-xl xs:rounded-2xl flex items-center justify-center mx-auto mb-2 xxs:mb-3 sm:mb-4">
                        <Package className="h-5 w-5 xxs:h-6 xxs:w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-2 xxs:mb-3 sm:mb-4 text-[10px] xxs:text-xs xs:text-sm sm:text-base">
                        Your cart is empty
                      </p>
                      <Button
                        variant="outline"
                        className="rounded-lg xxs:rounded-xl xs:rounded-2xl border-2 text-[10px] xxs:text-xs h-6 xxs:h-7 xs:h-8 sm:h-10"
                        asChild
                      >
                        <Link href="/products">Shop Now</Link>
                      </Button>
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <>
                    <div className="border-t border-border pt-2 xxs:pt-3 xs:pt-4 sm:pt-6 mb-2 xxs:mb-3 xs:mb-4 sm:mb-6">
                      <div className="space-y-1 xxs:space-y-1.5 xs:space-y-2 md:space-y-3 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <span className="font-semibold">
                            {formatPrice(subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Shipping
                          </span>
                          <span className="font-semibold">
                            {formatPrice(shipping[selectedShippingMethod])}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Tax (GST 18%)
                          </span>
                          <span className="font-semibold">
                            ₹{tax.toFixed(2)}
                          </span>
                        </div>
                        <div className="pt-1 xxs:pt-1.5 xs:pt-2 md:pt-3 mt-1 xxs:mt-1.5 xs:mt-2 md:mt-3 border-t border-border flex justify-between">
                          <span className="font-bold text-[10px] xxs:text-xs xs:text-sm sm:text-base md:text-lg">
                            Total
                          </span>
                          <span className="font-bold text-[10px] xxs:text-xs xs:text-sm sm:text-base md:text-lg">
                            ₹{total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-md xxs:rounded-lg xs:rounded-xl md:rounded-2xl p-1 xxs:p-1.5 xs:p-2 sm:p-3 md:p-4 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm border border-amber-200 dark:border-amber-800/50">
                      <div className="flex items-start space-x-1 xxs:space-x-1.5 xs:space-x-2 md:space-x-3">
                        <div className="w-3 h-3 xxs:w-3.5 xxs:h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 bg-amber-500 dark:bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertTriangle className="h-1.5 w-1.5 xxs:h-2 xxs:w-2 xs:h-2.5 xs:w-2.5 md:h-3 md:w-3 text-white" />
                        </div>
                        <p className="text-amber-800 dark:text-amber-400 leading-relaxed text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-xs md:text-sm">
                          By placing your order, you agree to our{" "}
                          <Link
                            href="/terms"
                            className="text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 underline font-medium"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 underline font-medium"
                          >
                            Privacy Policy
                          </Link>
                          .
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Address Dialog */}
        <AddressDialog
          isOpen={isAddressDialogOpen}
          setIsOpen={setIsAddressDialogOpen}
          onAddAddress={handleAddAddress}
        />
      </div>
    </div>
  );
}

// Address Dialog Component for adding new addresses
function AddressDialog({ isOpen, setIsOpen, onAddAddress }) {
  // Add theme support
  const { theme } = useTheme();

  const addressForm = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      name: "",
      phoneNo: "",
      email: "",
      houseNo: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      addressType: "home",
      isDefault: false,
    },
  });

  const onSubmit = async (values) => {
    await onAddAddress(values);
    addressForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[95%] max-w-[95vw] xxs:max-w-[450px] xs:max-w-[500px] sm:max-w-[700px] p-1.5 xxs:p-2 xs:p-4 sm:p-6 rounded-lg xxs:rounded-xl xs:rounded-2xl sm:rounded-3xl border-0 bg-background/95 backdrop-blur-xl shadow-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-1.5 xxs:pb-2 xs:pb-3 sm:pb-6">
          <DialogTitle className="text-sm xxs:text-base xs:text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
            Add New Address
          </DialogTitle>
          <DialogDescription className="text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
            Enter your address details below. We'll save this for future orders.
          </DialogDescription>
        </DialogHeader>

        <Form
          {...addressForm}
          className="[&_[role=alert]]:text-[9px] [&_[role=alert]]:xxs:text-[10px] [&_[role=alert]]:xs:text-xs"
        >
          <form
            onSubmit={addressForm.handleSubmit(onSubmit)}
            className="space-y-1.5 xxs:space-y-2 xs:space-y-3 sm:space-y-6"
          >
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 xxs:gap-2 xs:gap-3 sm:gap-6">
              <FormField
                control={addressForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] xxs:text-xs xs:text-sm font-semibold">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="h-6 xxs:h-7 xs:h-8 sm:h-10 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm rounded-md xxs:rounded-lg xs:rounded-xl border border-input focus:border-blue-500 dark:focus:border-blue-400 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addressForm.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] xxs:text-xs xs:text-sm font-semibold">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="9876543210"
                        className="h-6 xxs:h-7 xs:h-8 sm:h-10 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm rounded-md xxs:rounded-lg xs:rounded-xl border border-input focus:border-blue-500 dark:focus:border-blue-400 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={addressForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] xxs:text-xs xs:text-sm font-semibold">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      className="h-6 xxs:h-7 xs:h-8 sm:h-10 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm rounded-md xxs:rounded-lg xs:rounded-xl border border-input focus:border-blue-500 dark:focus:border-blue-400 bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 xxs:gap-2 xs:gap-3 sm:gap-6">
              <FormField
                control={addressForm.control}
                name="houseNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] xxs:text-xs xs:text-sm font-semibold">
                      House/Flat No.
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apartment 4B"
                        className="h-6 xxs:h-7 xs:h-8 sm:h-10 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm rounded-md xxs:rounded-lg xs:rounded-xl border border-input focus:border-blue-500 dark:focus:border-blue-400 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addressForm.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] xxs:text-xs xs:text-sm font-semibold">
                      Street Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main Street"
                        className="h-6 xxs:h-7 xs:h-8 sm:h-10 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm rounded-md xxs:rounded-lg xs:rounded-xl border border-input focus:border-blue-500 dark:focus:border-blue-400 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-1.5 xxs:gap-2 xs:gap-3 sm:gap-6">
              <FormField
                control={addressForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] xxs:text-xs xs:text-sm font-semibold">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="New Delhi"
                        className="h-6 xxs:h-7 xs:h-8 sm:h-10 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm rounded-md xxs:rounded-lg xs:rounded-xl border border-input focus:border-blue-500 dark:focus:border-blue-400 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addressForm.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] xxs:text-xs xs:text-sm font-semibold">
                      State
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Delhi"
                        className="h-6 xxs:h-7 xs:h-8 sm:h-10 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm rounded-md xxs:rounded-lg xs:rounded-xl border border-input focus:border-blue-500 dark:focus:border-blue-400 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addressForm.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] xxs:text-xs xs:text-sm font-semibold">
                      Postal Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="110001"
                        className="h-6 xxs:h-7 xs:h-8 sm:h-10 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm rounded-md xxs:rounded-lg xs:rounded-xl border border-input focus:border-blue-500 dark:focus:border-blue-400 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={addressForm.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] xxs:text-xs xs:text-sm font-semibold">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="India"
                      className="h-6 xxs:h-7 xs:h-8 sm:h-10 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm rounded-md xxs:rounded-lg xs:rounded-xl border border-input focus:border-blue-500 dark:focus:border-blue-400 bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addressForm.control}
              name="addressType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] xxs:text-xs xs:text-sm font-semibold">
                    Address Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-6 xxs:h-7 xs:h-8 sm:h-10 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm rounded-md xxs:rounded-lg xs:rounded-xl border border-input focus:border-blue-500 dark:focus:border-blue-400 bg-background">
                        <SelectValue placeholder="Select address type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-md xxs:rounded-lg xs:rounded-xl border text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm">
                      <SelectItem
                        value="home"
                        className="rounded-md xxs:rounded-lg text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm h-6 xxs:h-7 xs:h-8 sm:h-10"
                      >
                        <div className="flex items-center gap-1 xxs:gap-2">
                          <Home className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-4 xs:w-4" />
                          <span>Home</span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="work"
                        className="rounded-md xxs:rounded-lg text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm h-6 xxs:h-7 xs:h-8 sm:h-10"
                      >
                        <div className="flex items-center gap-1 xxs:gap-2">
                          <Briefcase className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-4 xs:w-4" />
                          <span>Work</span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="other"
                        className="rounded-md xxs:rounded-lg text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm h-6 xxs:h-7 xs:h-8 sm:h-10"
                      >
                        <div className="flex items-center gap-1 xxs:gap-2">
                          <MapPin className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-4 xs:w-4" />
                          <span>Other</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addressForm.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-1 xxs:space-x-1.5 xs:space-x-2 space-y-0 p-1 xxs:p-1.5 xs:p-2 sm:p-4 rounded-md xxs:rounded-lg xs:rounded-xl sm:rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-4 xs:w-4 mt-0.5 xxs:mt-1 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5 leading-tight">
                    <FormLabel className="text-[10px] xxs:text-xs xs:text-sm font-semibold">
                      Set as default address
                    </FormLabel>
                    <FormDescription className="text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
                      This address will be selected by default for shipping
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-1.5 xxs:pt-2 xs:pt-3 sm:pt-6 border-t border-border flex flex-col xs:flex-row gap-1 xxs:gap-1.5 xs:gap-2 sm:gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-6 xxs:h-7 xs:h-8 sm:h-11 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm rounded-md xxs:rounded-lg xs:rounded-xl sm:rounded-2xl border px-2 xxs:px-3 xs:px-4 sm:px-6 w-full xs:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addressForm.formState.isSubmitting}
                className="h-6 xxs:h-7 xs:h-8 sm:h-11 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-500 text-white shadow-lg rounded-md xxs:rounded-lg xs:rounded-xl sm:rounded-2xl px-2 xxs:px-3 xs:px-4 sm:px-8 w-full xs:w-auto"
              >
                {addressForm.formState.isSubmitting && (
                  <div className="mr-1 xxs:mr-1.5 h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-4 xs:w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></div>
                )}
                Save Address
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
