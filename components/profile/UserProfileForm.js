"use client";

import React, { useState, useEffect } from "react";
import { useSecureApi } from "@/helpers/useSecureApi";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function UserProfileForm() {
  const { data: session } = useSession();
  const { loading, error, secureGet, securePut } = useSecureApi();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch user data securely when component mounts
  useEffect(() => {
    async function fetchUserData() {
      if (session) {
        try {
          const data = await secureGet("/api/user/profile");
          if (data.success && data.user) {
            setUserData({
              name: data.user.name || "",
              email: data.user.email || "",
              phone: data.user.phone || "",
              address: data.user.address || {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
              },
            });
          }
        } catch (err) {
          toast.error("Failed to load profile data");
          console.error("Error loading profile:", err);
        }
      }
    }

    fetchUserData();
  }, [session, secureGet]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setUserData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission with secure API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      toast.error("You must be signed in to update your profile");
      return;
    }

    setFormSubmitting(true);

    try {
      // Uses securePut which automatically encrypts sensitive data
      const response = await securePut("/api/user/profile", {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
      });

      if (response.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Error updating profile");
      console.error("Profile update error:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading && !userData.name) {
    return (
      <div className="flex justify-center py-8">Loading your profile...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Your Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
              required
            />
          </div>

          {/* Email field (read-only) */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              readOnly
            />
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed
            </p>
          </div>

          {/* Phone number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
            />
          </div>
        </div>

        <div className="mt-8 mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Address Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Street */}
            <div className="md:col-span-2">
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Street Address
              </label>
              <input
                type="text"
                id="street"
                name="address.street"
                value={userData.address?.street || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
              />
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="address.city"
                value={userData.address?.city || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
              />
            </div>

            {/* State/Province */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                State / Province
              </label>
              <input
                type="text"
                id="state"
                name="address.state"
                value={userData.address?.state || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
              />
            </div>

            {/* Zip/Postal Code */}
            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                ZIP / Postal Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="address.zipCode"
                value={userData.address?.zipCode || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
              />
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="address.country"
                value={userData.address?.country || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={formSubmitting || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {formSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
