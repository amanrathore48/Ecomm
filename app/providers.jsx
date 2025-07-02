"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import CartProvider from "@/stores/useCart";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
