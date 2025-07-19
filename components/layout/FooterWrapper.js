"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Don't show footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}
