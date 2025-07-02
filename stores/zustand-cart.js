import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,
      isAuthenticated: false,

      setAuthenticated: async (status) => {
        // When user logs in, sync guest cart with server
        if (status && !get().isAuthenticated) {
          const guestItems = get().items;
          set({ isAuthenticated: status });

          if (guestItems.length > 0) {
            try {
              // Sync each guest cart item with the server
              for (const item of guestItems) {
                await get().addItem({ _id: item.id }, item.quantity);
              }
            } catch (error) {
              console.error("Failed to sync guest cart:", error);
            }
          } else {
            // If guest cart is empty, fetch the user's cart from server
            await get().fetchCart();
          }
        } else {
          set({ isAuthenticated: status });
          if (!status) {
            // When logging out, clear the cart
            set({ items: [] });
          }
        }
      },

      // Add item to cart
      addItem: async (product, quantity = 1) => {
        set({ loading: true, error: null });
        const isAuth = get().isAuthenticated;

        try {
          if (isAuth) {
            // Authenticated user - sync with server
            const response = await fetch("/api/cart", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ productId: product._id, quantity }),
            });

            if (!response.ok) {
              throw new Error("Failed to add item to cart");
            }

            const data = await response.json();
            set({ items: data.items, loading: false });
          } else {
            // Guest user - use local storage
            const items = get().items;
            const existingItem = items.find((item) => item.id === product._id);

            if (existingItem) {
              set({
                items: items.map((item) =>
                  item.id === product._id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
                loading: false,
              });
            } else {
              set({
                items: [
                  ...items,
                  {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    quantity,
                  },
                ],
                loading: false,
              });
            }
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Remove item from cart
      removeItem: async (productId) => {
        set({ loading: true, error: null });
        const isAuth = get().isAuthenticated;

        try {
          if (isAuth) {
            const response = await fetch(`/api/cart?productId=${productId}`, {
              method: "DELETE",
            });

            if (!response.ok) {
              throw new Error("Failed to remove item from cart");
            }

            const data = await response.json();
            set({ items: data.items, loading: false });
          } else {
            // Guest user - update local storage
            const items = get().items.filter((item) => item.id !== productId);
            set({ items, loading: false });
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Update item quantity
      updateQuantity: async (productId, quantity) => {
        if (quantity < 1) return;

        set({ loading: true, error: null });
        const isAuth = get().isAuthenticated;

        try {
          if (isAuth) {
            const response = await fetch("/api/cart", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ productId, quantity }),
            });

            if (!response.ok) {
              throw new Error("Failed to update cart");
            }

            const data = await response.json();
            set({ items: data.items, loading: false });
          } else {
            // Guest user - update local storage
            const items = get().items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            );
            set({ items, loading: false });
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Clear cart
      clearCart: async () => {
        set({ loading: true, error: null });
        const isAuth = get().isAuthenticated;

        try {
          if (isAuth) {
            const response = await fetch("/api/cart", {
              method: "DELETE",
            });

            if (!response.ok) {
              throw new Error("Failed to clear cart");
            }
          }

          set({ items: [], loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Get cart total
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      // Get cart item count
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      // Fetch cart data
      fetchCart: async () => {
        set({ loading: true, error: null });
        const isAuth = get().isAuthenticated;

        try {
          if (isAuth) {
            const response = await fetch("/api/cart");

            if (!response.ok) {
              throw new Error("Failed to fetch cart");
            }

            const data = await response.json();
            set({ items: data.items || [], loading: false });
          } else {
            // For guest users, cart is already in local storage
            set({ loading: false });
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;
