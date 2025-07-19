"use server";

import { encryptSensitiveData, decryptSensitiveData } from "./encryption";
import { NextResponse } from "next/server";

/**
 * Middleware for handling encryption/decryption in App Router API routes
 * @param {Function} handler - Original handler function
 * @returns {Function} Enhanced handler with encryption/decryption
 */
export function withAppRouterEncryption(handler) {
  return async (request, ...args) => {
    let req = request.clone();

    // Handle decryption of request body for methods that have a body
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      try {
        const originalBody = await req.json();

        // If there's a request body with user data, decrypt it
        if (
          originalBody &&
          (originalBody.user ||
            originalBody.userData ||
            originalBody.customer ||
            originalBody.address ||
            originalBody.payment)
        ) {
          const decryptedBody = decryptSensitiveData(originalBody);

          // Create a new request with the decrypted body
          req = new Request(req.url, {
            method: req.method,
            headers: req.headers,
            body: JSON.stringify(decryptedBody),
          });
        }
      } catch (error) {
        console.error("Error decrypting request data:", error);
        // Continue with original request if decryption fails
      }
    }

    // Call the original handler with potentially decrypted request
    const response = await handler(req, ...args);

    // Check if we need to encrypt the response
    if (response.status >= 200 && response.status < 300) {
      try {
        const originalData = await response.json();

        // Only encrypt responses containing user data
        if (originalData && shouldEncryptResponse(originalData)) {
          const encryptedData = encryptSensitiveData(originalData);

          // Return a new response with encrypted data
          return NextResponse.json(encryptedData, {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
          });
        }

        // Return the original data if encryption isn't needed
        return NextResponse.json(originalData, {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        });
      } catch (error) {
        console.error("Error encrypting response data:", error);
        // Return the original response if JSON parsing or encryption fails
        return response;
      }
    }

    // Return the original response for non-success status codes
    return response;
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

export default withAppRouterEncryption;
