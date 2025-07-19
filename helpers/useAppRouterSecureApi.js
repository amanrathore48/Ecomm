"use client";

import { useState } from "react";
import { encryptSensitiveData, decryptSensitiveData } from "@/lib/encryption";

/**
 * Custom hook for secure API requests with App Router
 * @returns {Object} Methods for secure API operations
 */
export function useAppRouterSecureApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Determines if data contains sensitive fields that need encryption
   * @param {Object} data - Data to check
   * @returns {Boolean} True if data contains sensitive fields
   */
  const containsSensitiveData = (data) => {
    if (!data || typeof data !== "object") return false;

    const sensitiveFields = [
      "user",
      "userData",
      "userInfo",
      "profile",
      "customer",
      "customerData",
      "payment",
      "paymentInfo",
      "transaction",
      "billingAddress",
      "shippingAddress",
      "address",
      "phone",
      "email",
      "password",
      "cardNumber",
      "cvv",
    ];

    return Object.keys(data).some((key) =>
      sensitiveFields.some((field) =>
        key.toLowerCase().includes(field.toLowerCase())
      )
    );
  };

  /**
   * Make a secure GET request
   * @param {String} url - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data with sensitive fields decrypted
   */
  const secureGet = async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Try to decrypt any sensitive data in the response
      const decryptedData = decryptSensitiveData(data);

      setLoading(false);
      return decryptedData;
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      setLoading(false);
      throw err;
    }
  };

  /**
   * Make a secure POST request
   * @param {String} url - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data with sensitive fields decrypted
   */
  const securePost = async (url, data, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Check if data contains sensitive information
      const requestData = containsSensitiveData(data)
        ? encryptSensitiveData(data)
        : data;

      const response = await fetch(url, {
        ...options,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const responseData = await response.json();

      // Try to decrypt any sensitive data in the response
      const decryptedData = decryptSensitiveData(responseData);

      setLoading(false);
      return decryptedData;
    } catch (err) {
      setError(err.message || "Failed to submit data");
      setLoading(false);
      throw err;
    }
  };

  /**
   * Make a secure PUT request
   * @param {String} url - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data with sensitive fields decrypted
   */
  const securePut = async (url, data, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Check if data contains sensitive information
      const requestData = containsSensitiveData(data)
        ? encryptSensitiveData(data)
        : data;

      const response = await fetch(url, {
        ...options,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const responseData = await response.json();

      // Try to decrypt any sensitive data in the response
      const decryptedData = decryptSensitiveData(responseData);

      setLoading(false);
      return decryptedData;
    } catch (err) {
      setError(err.message || "Failed to update data");
      setLoading(false);
      throw err;
    }
  };

  /**
   * Make a secure DELETE request
   * @param {String} url - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   */
  const secureDelete = async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Failed to delete data");
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    secureGet,
    securePost,
    securePut,
    secureDelete,
  };
}

export default useAppRouterSecureApi;
