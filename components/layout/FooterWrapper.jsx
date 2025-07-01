"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  // Hide footer on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }
  return <Footer />;
}
