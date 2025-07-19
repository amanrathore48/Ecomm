const crypto = require("crypto");

// Get encryption key from environment variable or generate one from NEXTAUTH_SECRET
// Using a 32-byte (256-bit) key for AES-256-CBC encryption
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY ||
  crypto
    .createHash("sha256")
    .update(process.env.NEXTAUTH_SECRET)
    .digest("hex")
    .substring(0, 32);

// 16 bytes IV for AES-CBC algorithm
const IV_LENGTH = 16;

/**
 * Encrypts sensitive data
 * @param {Object|String} data - Data to encrypt
 * @returns {String} Encrypted data as a base64 string
 */
function encryptData(data) {
  if (!data) return null;

  try {
    // Convert object to string if necessary
    const text = typeof data === "object" ? JSON.stringify(data) : String(data);

    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create cipher with key and iv
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      iv
    );

    // Encrypt the data
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");

    // Combine IV and encrypted data and return as base64
    return Buffer.concat([iv, Buffer.from(encrypted, "base64")]).toString(
      "base64"
    );
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypts encrypted data
 * @param {String} encryptedData - Base64 encoded encrypted data
 * @returns {Object|String} Decrypted data, parsed as JSON if possible
 */
function decryptData(encryptedData) {
  if (!encryptedData) return null;

  try {
    // Convert base64 string to buffer
    const buffer = Buffer.from(encryptedData, "base64");

    // Extract iv from the beginning of the buffer
    const iv = buffer.slice(0, IV_LENGTH);

    // Extract encrypted data after iv
    const encrypted = buffer.slice(IV_LENGTH);

    // Create decipher
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      iv
    );

    // Decrypt the data
    let decrypted = decipher.update(encrypted, undefined, "utf8");
    decrypted += decipher.final("utf8");

    // Try to parse as JSON, return as string if it fails
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Determines if an object field should be encrypted based on sensitivity
 * @param {String} fieldName - Name of the field
 * @returns {Boolean} True if field should be encrypted
 */
function isSensitiveField(fieldName) {
  const sensitiveFields = [
    // Personal identifiable information
    "password",
    "passwordHash",
    "passwordSalt",
    "ssn",
    "socialSecurityNumber",
    "dob",
    "dateOfBirth",
    "birthdate",

    // Payment information
    "cardNumber",
    "cvv",
    "securityCode",
    "ccv",
    "cardExpiry",
    "expiryDate",
    "bankAccount",
    "accountNumber",
    "routingNumber",
    "wallet",
    "walletAddress",

    // Address information (could be considered sensitive)
    "address",
    "fullAddress",
    "billingAddress",
    "shippingAddress",

    // Contact information
    "phone",
    "phoneNumber",
    "mobileNumber",

    // Other sensitive fields
    "apiKey",
    "accessToken",
    "refreshToken",
  ];

  // Case insensitive check if field name contains any sensitive terms
  return sensitiveFields.some((field) =>
    fieldName.toLowerCase().includes(field.toLowerCase())
  );
}

/**
 * Recursively encrypts sensitive fields in an object
 * @param {Object} obj - Object to process
 * @returns {Object} New object with encrypted sensitive fields
 */
function encryptSensitiveData(obj) {
  if (!obj || typeof obj !== "object") return obj;

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => encryptSensitiveData(item));
  }

  // Create a new object to avoid modifying the original
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip null and undefined values
    if (value === null || value === undefined) {
      result[key] = value;
      continue;
    }

    // Recursively process nested objects
    if (typeof value === "object") {
      result[key] = encryptSensitiveData(value);
    }
    // Encrypt sensitive string fields
    else if (typeof value === "string" && isSensitiveField(key)) {
      result[key] = encryptData(value);
    }
    // Keep non-sensitive fields as is
    else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Recursively decrypts sensitive fields in an object
 * @param {Object} obj - Object with encrypted fields
 * @returns {Object} New object with decrypted sensitive fields
 */
function decryptSensitiveData(obj) {
  if (!obj || typeof obj !== "object") return obj;

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => decryptSensitiveData(item));
  }

  // Create a new object to avoid modifying the original
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip null and undefined values
    if (value === null || value === undefined) {
      result[key] = value;
      continue;
    }

    // Recursively process nested objects
    if (typeof value === "object" && !Buffer.isBuffer(value)) {
      result[key] = decryptSensitiveData(value);
    }
    // Decrypt sensitive string fields
    else if (typeof value === "string" && isSensitiveField(key)) {
      try {
        result[key] = decryptData(value);
      } catch (err) {
        // If decryption fails, assume it wasn't encrypted
        result[key] = value;
      }
    }
    // Keep non-sensitive fields as is
    else {
      result[key] = value;
    }
  }

  return result;
}

module.exports = {
  encryptData,
  decryptData,
  encryptSensitiveData,
  decryptSensitiveData,
  isSensitiveField,
};
