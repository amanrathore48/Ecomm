"use client";

import { useState } from "react";
import Image from "next/image";

export function ImageWithFallback({
  src,
  fallbackSrc = "/images/placeholder.png",
  alt,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
