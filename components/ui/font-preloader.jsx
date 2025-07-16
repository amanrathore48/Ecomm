"use client";

import { useEffect } from "react";

// Component to ensure fonts are loaded properly
export const FontPreloader = () => {
  useEffect(() => {
    // Add font loading observer
    if ("fonts" in document) {
      Promise.all([
        document.fonts.load("1em Poppins"),
        document.fonts.load("1em Playfair Display"),
        document.fonts.load("1em Source Code Pro"),
      ])
        .then(() => {
          // When fonts are loaded, add a class to the body
          document.body.classList.add("fonts-loaded");
          console.log("All required fonts have been loaded");
        })
        .catch((err) => {
          console.error("Font loading failed:", err);
        });
    }
  }, []);

  return null; // This component doesn't render anything
};
