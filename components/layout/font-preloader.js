"use client";

import { useEffect } from "react";
import { Poppins, Playfair_Display, Source_Code_Pro } from "next/font/google";

// Configure the fonts
export const fontSans = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const fontSerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const fontMono = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export function FontPreloader() {
  useEffect(() => {
    // Add a class to the document once fonts are loaded
    const handleFontsLoaded = () => {
      document.documentElement.classList.add("fonts-loaded");
    };

    // Check if the document fonts API is available
    if ("fonts" in document) {
      document.fonts.ready.then(handleFontsLoaded);
    } else {
      // Fallback for browsers that don't support document.fonts
      // Set a timeout to add the class after a reasonable loading time
      setTimeout(handleFontsLoaded, 500);
    }
  }, []);

  return null; // This component doesn't render anything
}
