// API server URL configuration with fallback mechanism
export const server =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://ecomm-eight-pearl.vercel.app/api";

// Default request timeout in milliseconds
const DEFAULT_TIMEOUT = 8000;

// Maximum number of retries for failed requests
const MAX_RETRIES = 2;

// Delay between retries (with exponential backoff)
const getRetryDelay = (attempt) => Math.pow(2, attempt) * 1000;

/**
 * Enhanced fetch API wrapper with timeout, retry, and error handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Request timeout in milliseconds
 * @param {number} retries - Maximum number of retries
 * @returns {Promise<Object>} - Parsed JSON response
 */
export async function fetchWithTimeout(
  url,
  options = {},
  timeout = DEFAULT_TIMEOUT,
  retries = MAX_RETRIES
) {
  // Use AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Add signal to options
  const fetchOptions = {
    ...options,
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    // Handle HTTP error status codes
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }

      const error = new Error(
        `HTTP error ${response.status}: ${errorData.message || "Unknown error"}`
      );
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    // Specific error handling based on error type
    if (error.name === "AbortError") {
      const timeoutError = new Error("Request timed out");
      timeoutError.name = "TimeoutError";

      // Retry logic for timeouts
      if (retries > 0) {
        console.log(
          `Request timed out, retrying... (${retries} attempts left)`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, getRetryDelay(MAX_RETRIES - retries))
        );
        return fetchWithTimeout(url, options, timeout, retries - 1);
      }

      throw timeoutError;
    }

    // Network errors (DNS resolution, connection refused, etc)
    if (error.message && error.message.includes("fetch")) {
      const networkError = new Error(
        "Network error, please check your connection"
      );
      networkError.name = "NetworkError";
      networkError.cause = error;

      // Retry for network errors
      if (retries > 0) {
        console.log(`Network error, retrying... (${retries} attempts left)`);
        await new Promise((resolve) =>
          setTimeout(resolve, getRetryDelay(MAX_RETRIES - retries))
        );
        return fetchWithTimeout(url, options, timeout, retries - 1);
      }

      throw networkError;
    }

    // Re-throw any other errors
    throw error;
  }
}

/**
 * Get request with enhanced error handling and retries
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Parsed JSON response
 */
export const apiGet = (endpoint, options = {}) => {
  const url = `${server}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;
  return fetchWithTimeout(url, {
    method: "GET",
    ...options,
    // Prevent caching issues in some browsers
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      ...options.headers,
    },
  });
};

/**
 * Post request with enhanced error handling and retries
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Parsed JSON response
 */
export const apiPost = (endpoint, data = {}, options = {}) => {
  const url = `${server}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;
  return fetchWithTimeout(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * Put request with enhanced error handling and retries
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Parsed JSON response
 */
export const apiPut = (endpoint, data = {}, options = {}) => {
  const url = `${server}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;
  return fetchWithTimeout(url, {
    method: "PUT",
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * Delete request with enhanced error handling and retries
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Parsed JSON response
 */
export const apiDelete = (endpoint, options = {}) => {
  const url = `${server}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;
  return fetchWithTimeout(url, {
    method: "DELETE",
    ...options,
  });
};
