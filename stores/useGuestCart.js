import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSession } from "next-auth/react";

const useGuestCart = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product._id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
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
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      // For syncing with server when user logs in
      getItems: () => get().items,
    }),
    {
      name: "guest-cart",
    }
  )
);
