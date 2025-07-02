"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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
  paymentMethod: z.enum(["credit_card", "paypal"], {
    message: "Please select a payment method.",
  }),
});

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const { toast } = useToast();

  const { items, getTotal } = useCartStore();
  const shipping = 5.99;
  const subtotal = getTotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

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
      paymentMethod: "credit_card",
    },
  });

  const onSubmit = async (values) => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setOrderCompleted(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There was a problem processing your order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <p className="mb-8 text-primary font-medium">Order #ORD-2024-0045</p>
          <div className="space-y-4">
            <Button asChild size="lg">
              <Link href="/orders">View Order</Link>
            </Button>
            <div>
              <Button variant="outline" asChild size="lg">
                <Link href="/">Continue Shopping</Link>
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
                {mockCartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 rounded bg-secondary/20 flex-shrink-0">
                      <Image
                        src={item.image}
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
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
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
