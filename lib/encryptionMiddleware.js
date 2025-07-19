"use client";

import { encryptSensitiveData, decryptSensitiveData } from "@/lib/encryption";

/**
 * Higher-order function to add encryption/decryption to API handlers
 * @param {Function} handler - Original API route handler
 * @returns {Function} Enhanced handler with encryption/decryption
 */
export function withEncryption(handler) {
  return async (req, res) => {
    // Only modify POST, PUT, and PATCH requests
    if (
      req.method === "POST" ||
      req.method === "PUT" ||
      req.method === "PATCH"
    ) {
      try {
        // If there's a request body with user data, decrypt it
        if (
          req.body &&
          (req.body.user ||
            req.body.userData ||
            req.body.customer ||
            req.body.address ||
            req.body.payment)
        ) {
          req.body = decryptSensitiveData(req.body);
        }
      } catch (error) {
        console.error("Error decrypting request data:", error);
        // Continue with original data if decryption fails
      }
    }

    // Call the original handler with potentially decrypted data
    const originalResponse = await handler(req, res);

    // Check if we need to encrypt the response
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        // Only encrypt responses containing user data
        const data = res._getJSONData?.() || res.locals?.data;

        if (data && shouldEncryptResponse(data)) {
          const encryptedData = encryptSensitiveData(data);

          // Override the response with encrypted data
          if (res.json && typeof res.json === "function") {
            return res.json(encryptedData);
          } else if (res.send && typeof res.send === "function") {
            return res.send(JSON.stringify(encryptedData));
          }
        }
      } catch (error) {
        console.error("Error encrypting response data:", error);
        // Return the original response if encryption fails
      }
    }

    return originalResponse;
  };
}

/**
 * Determines if a response should have its sensitive data encrypted
 * @param {Object} data - Response data object
 * @returns {Boolean} True if the response contains user data
 */
function shouldEncryptResponse(data) {
  // Only encrypt responses with user data or payment information
  const sensitiveDataIndicators = [
    "user",
    "userData",
    "userInfo",
    "profile",
    "customer",
    "customerData",
    "payment",
    "paymentInfo",
    "transaction",
    "billingInfo",
    "shippingInfo",
    "personalInfo",
    "address",
  ];

  // Check if any keys in the response match our sensitive data indicators
  return Object.keys(data).some((key) =>
    sensitiveDataIndicators.some((indicator) =>
      key.toLowerCase().includes(indicator.toLowerCase())
    )
  );
}

/**
 * Enhanced fetch function that encrypts sensitive request data and decrypts response data
 * @param {String} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Decrypted response data
 */
export async function secureFetch(url, options = {}) {
  // Check if there's a body that needs encryption
  if (options.body && typeof options.body === "string") {
    try {
      const bodyData = JSON.parse(options.body);

      // Only encrypt if the data contains sensitive fields
      if (shouldEncryptResponse(bodyData)) {
        options.body = JSON.stringify(encryptSensitiveData(bodyData));
      }
    } catch (error) {
      // Not a JSON string or encryption failed, proceed with original body
    }
  }

  // Make the fetch request
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type");

  // Only process JSON responses
  if (contentType?.includes("application/json")) {
    const data = await response.json();

    // Try to decrypt any sensitive fields in the response
    try {
      return decryptSensitiveData(data);
    } catch (error) {
      // Return original data if decryption fails
      return data;
    }
  }

  return response;
}

export default withEncryption;
