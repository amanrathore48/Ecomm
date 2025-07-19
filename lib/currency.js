/**
 * Format a number as Indian Rupees
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol (default: true)
 * @returns {string} Formatted price
 */
export const formatPrice = (amount, showSymbol = true) => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formatted = formatter.format(amount);
  return showSymbol ? formatted : formatted.replace("₹", "").trim();
};

/**
 * Convert price from other currency to INR
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - The currency to convert from (default: USD)
 * @returns {number} Amount in INR
 */
export const convertToINR = (amount, fromCurrency = "USD") => {
  // Example conversion rate (you should use real-time rates in production)
  const conversionRates = {
    USD: 82.5, // 1 USD = 82.50 INR (example rate)
    EUR: 90.21, // 1 EUR = 90.21 INR (example rate)
  };

  const rate = conversionRates[fromCurrency] || 1;
  return Math.round(amount * rate);
};
