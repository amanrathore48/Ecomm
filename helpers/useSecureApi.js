"use client";

import { useState, useEffect, useCallback } from "react";
import { secureFetch } from "@/lib/encryptionMiddleware";

/**
 * Custom hook to handle secure API requests with encryption
 * @returns {Object} Methods for secure API operations
 */
export function useSecureApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Make a secure GET request that handles decryption automatically
   * @param {String} url - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Decrypted response data
   */
  const secureGet = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await secureFetch(url, {
        ...options,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to fetch data securely");
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Make a secure POST request with automatic encryption
   * @param {String} url - API endpoint
   * @param {Object} data - Request payload (sensitive data will be encrypted)
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Decrypted response data
   */
  const securePost = useCallback(async (url, data, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await secureFetch(url, {
        ...options,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to post data securely");
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Make a secure PUT request with automatic encryption
   * @param {String} url - API endpoint
   * @param {Object} data - Request payload (sensitive data will be encrypted)
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Decrypted response data
   */
  const securePut = useCallback(async (url, data, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await secureFetch(url, {
        ...options,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to update data securely");
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Make a secure PATCH request with automatic encryption
   * @param {String} url - API endpoint
   * @param {Object} data - Request payload (sensitive data will be encrypted)
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Decrypted response data
   */
  const securePatch = useCallback(async (url, data, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await secureFetch(url, {
        ...options,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to patch data securely");
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Make a secure DELETE request
   * @param {String} url - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   */
  const secureDelete = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await secureFetch(url, {
        ...options,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to delete data securely");
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    secureGet,
    securePost,
    securePut,
    securePatch,
    secureDelete,
  };
}

export default useSecureApi;
