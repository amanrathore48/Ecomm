"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

export function useAddress() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async () => {
    if (!session) {
      setAddresses([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/address");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch addresses");
      }

      // Always set addresses to an array, even if missing or not an array
      setAddresses(Array.isArray(data.addresses) ? data.addresses : []);
      return Array.isArray(data.addresses) ? data.addresses : [];
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load addresses",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (addressData) => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to add an address",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add address");
      }

      // Refresh addresses after adding
      await fetchAddresses();

      toast({
        title: "Success",
        description: "Address added successfully",
      });

      return data.address;
    } catch (error) {
      console.error("Error adding address:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add address",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async (addressId, addressData) => {
    if (!session) return null;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/address/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update address");
      }

      // Refresh addresses after updating
      await fetchAddresses();

      toast({
        title: "Success",
        description: "Address updated successfully",
      });

      return data.address;
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update address",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAddress = async (addressId) => {
    if (!session) return false;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/address/${addressId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete address");
      }

      // Refresh addresses after deletion
      await fetchAddresses();

      toast({
        title: "Success",
        description: "Address deleted successfully",
      });

      return true;
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete address",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultAddress = async (addressId) => {
    if (!session) return false;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/address/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDefault: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set default address");
      }

      // Refresh addresses after updating
      await fetchAddresses();

      toast({
        title: "Success",
        description: "Default address updated",
      });

      return true;
    } catch (error) {
      console.error("Error setting default address:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to set default address",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addresses,
    isLoading,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
