import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,

      // Add item to wishlist (authenticated users only)
      addItem: async (product) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch("/api/wishlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId: product._id }),
          });

          if (response.status === 401) {
            set({
              error: "Please sign in to add items to wishlist",
              loading: false,
            });
            throw new Error("Authentication required");
          }

          if (!response.ok) {
            throw new Error("Failed to add item to wishlist");
          }

          const data = await response.json();
          set({ items: data.items, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Remove item from wishlist
      removeItem: async (productId) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch(`/api/wishlist?productId=${productId}`, {
            method: "DELETE",
          });

          if (response.status === 401) {
            set({ error: "Please sign in to manage wishlist", loading: false });
            throw new Error("Authentication required");
          }

          if (!response.ok) {
            throw new Error("Failed to remove item from wishlist");
          }

          const data = await response.json();
          set({ items: data.items, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Clear wishlist
      clearWishlist: async () => {
        set({ loading: true, error: null });

        try {
          const response = await fetch("/api/wishlist", {
            method: "DELETE",
          });

          if (response.status === 401) {
            set({ error: "Please sign in to manage wishlist", loading: false });
            throw new Error("Authentication required");
          }

          if (!response.ok) {
            throw new Error("Failed to clear wishlist");
          }

          set({ items: [], loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Fetch wishlist data
      fetchWishlist: async () => {
        set({ loading: true, error: null });

        try {
          const response = await fetch("/api/wishlist");

          if (response.status === 401) {
            set({ items: [], loading: false }); // Empty wishlist for non-authenticated users
            return;
          }

          if (!response.ok) {
            throw new Error("Failed to fetch wishlist");
          }

          const data = await response.json();
          set({ items: data.items || [], loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Check if item is in wishlist
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);

export default useWishlistStore;
