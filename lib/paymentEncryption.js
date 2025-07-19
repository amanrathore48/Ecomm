import { encryptData, decryptData } from "./encryption";

/**
 * A specialized encryption module for payment information
 */

/**
 * Encrypt payment details for secure transmission
 * @param {Object} paymentData - Payment information
 * @returns {Object} Object with encrypted payment data
 */
export function encryptPaymentData(paymentData) {
  if (!paymentData) return null;

  // Create a new object to avoid modifying the original
  const encryptedData = { ...paymentData };

  // List of fields to encrypt in payment data
  const sensitiveFields = [
    "cardNumber",
    "cvv",
    "securityCode",
    "cardholderName",
    "expiryDate",
    "expiryMonth",
    "expiryYear",
    "accountNumber",
    "routingNumber",
    "upiId",
    "walletId",
  ];

  // Encrypt each sensitive field
  for (const field of sensitiveFields) {
    if (encryptedData[field]) {
      encryptedData[field] = encryptData(encryptedData[field]);
    }
  }

  // Handle billing address separately if present
  if (encryptedData.billingAddress) {
    encryptedData.billingAddress = encryptData(encryptedData.billingAddress);
  }

  return encryptedData;
}

/**
 * Decrypt encrypted payment details
 * @param {Object} encryptedPaymentData - Encrypted payment information
 * @returns {Object} Decrypted payment data
 */
export function decryptPaymentData(encryptedPaymentData) {
  if (!encryptedPaymentData) return null;

  // Create a new object to avoid modifying the original
  const decryptedData = { ...encryptedPaymentData };

  // List of fields to decrypt in payment data
  const sensitiveFields = [
    "cardNumber",
    "cvv",
    "securityCode",
    "cardholderName",
    "expiryDate",
    "expiryMonth",
    "expiryYear",
    "accountNumber",
    "routingNumber",
    "upiId",
    "walletId",
  ];

  // Decrypt each sensitive field
  for (const field of sensitiveFields) {
    if (decryptedData[field] && typeof decryptedData[field] === "string") {
      try {
        decryptedData[field] = decryptData(decryptedData[field]);
      } catch (error) {
        // If decryption fails, assume it's not encrypted and keep original value
        console.warn(`Failed to decrypt payment field: ${field}`);
      }
    }
  }

  // Handle billing address separately if present
  if (
    decryptedData.billingAddress &&
    typeof decryptedData.billingAddress === "string"
  ) {
    try {
      decryptedData.billingAddress = decryptData(decryptedData.billingAddress);
    } catch (error) {
      console.warn("Failed to decrypt billing address");
    }
  }

  return decryptedData;
}

/**
 * Mask credit card number for display, keeping only last 4 digits visible
 * @param {String} cardNumber - Full card number
 * @returns {String} Masked card number (e.g., •••• •••• •••• 1234)
 */
export function maskCardNumber(cardNumber) {
  if (!cardNumber) return "";

  // Remove any spaces or dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, "");

  // Keep only the last 4 digits visible
  const lastFourDigits = cleanNumber.slice(-4);
  const maskedPart = "•".repeat(cleanNumber.length - 4);

  // Format with spaces for readability (groups of 4)
  let formatted = "";
  for (let i = 0; i < maskedPart.length; i++) {
    formatted += maskedPart[i];
    if ((i + 1) % 4 === 0 && i < maskedPart.length - 1) {
      formatted += " ";
    }
  }

  return `${formatted} ${lastFourDigits}`;
}

/**
 * Prepare payment data for storage by removing sensitive fields and masking others
 * @param {Object} paymentData - Complete payment information
 * @returns {Object} Safe payment data for storage
 */
export function preparePaymentDataForStorage(paymentData) {
  if (!paymentData) return null;

  // Create new object with only safe fields
  const safePaymentData = {
    paymentMethod: paymentData.paymentMethod,
    paymentProvider: paymentData.paymentProvider,
    timestamp: new Date().toISOString(),
  };

  // Add masked card info if present
  if (paymentData.cardNumber) {
    safePaymentData.lastFourDigits = paymentData.cardNumber.slice(-4);
    safePaymentData.maskedCardNumber = maskCardNumber(paymentData.cardNumber);

    // Add card type/brand if we can detect it
    safePaymentData.cardType = detectCardType(paymentData.cardNumber);
  }

  // Add expiry info without the CVV
  if (paymentData.expiryMonth && paymentData.expiryYear) {
    safePaymentData.expiryMonth = paymentData.expiryMonth;
    safePaymentData.expiryYear = paymentData.expiryYear;
  } else if (paymentData.expiryDate) {
    // Parse MM/YY format
    const parts = paymentData.expiryDate.split("/");
    if (parts.length === 2) {
      safePaymentData.expiryMonth = parts[0];
      safePaymentData.expiryYear = parts[1];
    }
  }

  // Add billing address country/postal code only if present
  if (paymentData.billingAddress) {
    if (typeof paymentData.billingAddress === "object") {
      safePaymentData.billingCountry = paymentData.billingAddress.country;
      safePaymentData.billingPostalCode =
        paymentData.billingAddress.zipCode ||
        paymentData.billingAddress.postalCode;
    }
  }

  return safePaymentData;
}

/**
 * Detect card type based on card number pattern
 * @param {String} cardNumber - Credit card number
 * @returns {String} Card type (Visa, Mastercard, etc.)
 */
function detectCardType(cardNumber) {
  if (!cardNumber) return "Unknown";

  const cleanNumber = cardNumber.replace(/[\s-]/g, "");

  // Simple regex patterns for common card types
  const patterns = {
    Visa: /^4/,
    Mastercard: /^(5[1-5]|2[2-7])/,
    Amex: /^3[47]/,
    Discover: /^(6011|65|64[4-9]|622)/,
    Diners: /^(36|38|30[0-5])/,
    JCB: /^35/,
    UnionPay: /^62/,
    Maestro: /^(5[0678]|6)/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleanNumber)) {
      return type;
    }
  }

  return "Unknown";
}

export default {
  encryptPaymentData,
  decryptPaymentData,
  maskCardNumber,
  preparePaymentDataForStorage,
};
