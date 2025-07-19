"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder-product.jpg",
  ...props
}) {
  // Function to determine the best source to use
  const getBestSource = (source) => {
    // If it's an array, use the first item
    if (Array.isArray(source) && source.length > 0) {
      return source[0];
    }
    // If it's a string, use it directly
    else if (typeof source === "string" && source) {
      return source;
    }
    // Otherwise use fallback
    return fallbackSrc;
  }; // Initialize with the best source
  const [imgSrc, setImgSrc] = useState(getBestSource(src));

  // Update source if props change
  useEffect(() => {
    setImgSrc(getBestSource(src));
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Product image"}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
