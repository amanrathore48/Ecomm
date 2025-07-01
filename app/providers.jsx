"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
