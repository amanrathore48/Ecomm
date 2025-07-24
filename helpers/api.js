// Dynamically set API base URL for dev/prod
export const server =
  process.env.NODE_ENV === "production"
    ? "https://ecomm-eight-pearl.vercel.app/api"
    : "http://localhost:3000/api";

// Helper function for GET requests with enhanced error handling

export async function apiGet(endpoint, options = {}) {
  const { timeout = 10000, retries = 1, headers = {} } = options;

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Always use the correct server base URL
    let fullUrl;
    if (endpoint.startsWith("http")) {
      fullUrl = endpoint;
    } else if (endpoint.startsWith("/")) {
      fullUrl = `${server}${endpoint}`;
    } else {
      fullUrl = `${server}/${endpoint}`;
    }

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
}
