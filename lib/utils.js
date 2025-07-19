import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price to a currency string
 * @param {number} price - The price to format
 * @param {string} currency - The currency code
 * @returns {string} - The formatted price
 */
export function formatPrice(price, currency = "INR") {
  if (typeof price !== "number") {
    return "₹0.00";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
