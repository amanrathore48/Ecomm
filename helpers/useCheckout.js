"use client";

import { useState } from "react";
import { useAppRouterSecureApi } from "./useAppRouterSecureApi";
import {
  encryptPaymentData,
  preparePaymentDataForStorage,
} from "@/lib/paymentEncryption";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCart } from "@/stores/useCart";
import { useSession } from "next-auth/react";

/**
 * Custom hook for secure checkout process
 * @returns {Object} Methods and state for checkout
 */
export function useCheckout() {
  const { data: session } = useSession();
  const router = useRouter();
  const { loading, securePost } = useAppRouterSecureApi();
  const { cartItems, clearCart, totalAmount } = useCart();

  const [checkoutStep, setCheckoutStep] = useState("shipping");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: "card", // card, cod, wallet
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  /**
   * Handle shipping form submission
   * @param {Object} data - Shipping form data
   */
  const handleShippingSubmit = (data) => {
    setShippingInfo(data);
    setCheckoutStep("payment");
  };

  /**
   * Handle payment form submission
   * @param {Object} data - Payment form data
   */
  const handlePaymentSubmit = async (data) => {
    setPaymentInfo(data);

    if (!session) {
      toast.error("Please sign in to complete your order");
      router.push("/signin?redirect=checkout");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      router.push("/products");
      return;
    }

    setPaymentProcessing(true);
    setOrderError(null);

    try {
      // Encrypt sensitive payment data
      const encryptedPaymentData = encryptPaymentData(data);

      // Create safe version for storage (masked card number, etc)
      const safePaymentData = preparePaymentDataForStorage(data);

      // Create order with encrypted payment data
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image,
        })),
        shippingInfo, // Address data
        paymentInfo: encryptedPaymentData, // Encrypted payment data
        paymentSummary: safePaymentData, // Safe data for display/storage
        amount: {
          subtotal: totalAmount,
          tax: totalAmount * 0.05, // 5% tax
          shipping: totalAmount > 1000 ? 0 : 100, // Free shipping over ₹1000
          discount: 0,
          total:
            totalAmount > 1000
              ? totalAmount + totalAmount * 0.05
              : totalAmount + totalAmount * 0.05 + 100,
        },
      };

      // Use the secure API to submit the order
      const response = await securePost("/api/orders", orderData);

      if (response.success) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/orders/${response.order._id}`);
      } else {
        setOrderError(response.message || "Failed to place order");
        toast.error(response.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setOrderError("There was an error processing your payment");
      toast.error("Payment processing failed");
    } finally {
      setPaymentProcessing(false);
    }
  };

  /**
   * Go back to previous checkout step
   */
  const goBack = () => {
    if (checkoutStep === "payment") {
      setCheckoutStep("shipping");
    }
  };

  return {
    loading,
    checkoutStep,
    shippingInfo,
    paymentInfo,
    paymentProcessing,
    orderError,
    handleShippingSubmit,
    handlePaymentSubmit,
    setShippingInfo,
    setPaymentInfo,
    goBack,
  };
}

export default useCheckout;
