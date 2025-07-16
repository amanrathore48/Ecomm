"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Typography variants with standard font classes
const typographyVariants = {
  h1: "font-serif text-4xl font-bold leading-tight tracking-tight md:text-5xl",
  h2: "font-serif text-3xl font-semibold leading-tight",
  h3: "font-serif text-2xl font-semibold leading-snug",
  h4: "font-serif text-xl font-semibold leading-snug",
  h5: "font-serif text-lg font-medium leading-snug",
  h6: "font-serif text-base font-medium leading-normal",
  p: "font-sans text-base leading-relaxed",
  blockquote: "font-sans pl-4 border-l-4 border-border italic",
  lead: "font-sans text-lg text-muted-foreground leading-relaxed",
  large: "font-sans text-lg font-medium",
  small: "font-sans text-sm font-medium leading-none",
  muted: "font-sans text-sm text-muted-foreground",
  subtle: "font-sans text-muted-foreground",
  "product-title": "font-serif text-xl font-medium leading-tight",
  "section-title": "font-serif text-2xl font-semibold tracking-tight",
  price: "font-sans font-semibold",
  "sale-price": "font-sans font-bold text-red-600",
};

// Typography component
export function Typography({
  variant = "p",
  children,
  className,
  as,
  color,
  ...props
}) {
  // Determine the element type based on variant or as prop
  const Component = as || variant || "p";

  // Base styles from variant
  const variantStyles = typographyVariants[variant] || typographyVariants.p;

  // Color styles
  const colorStyles = color ? `text-${color}` : "";

  return (
    <Component className={cn(variantStyles, colorStyles, className)} {...props}>
      {children}
    </Component>
  );
}

// Specialized components
export function Heading({ level = 1, children, ...props }) {
  const validLevel = Math.max(1, Math.min(6, level));
  const variant = `h${validLevel}`;
  return (
    <Typography variant={variant} as={variant} {...props}>
      {children}
    </Typography>
  );
}

export function ProductTitle({ children, ...props }) {
  return (
    <Typography variant="product-title" as="h2" {...props}>
      {children}
    </Typography>
  );
}

export function SectionTitle({ children, ...props }) {
  return (
    <Typography variant="section-title" as="h2" {...props}>
      {children}
    </Typography>
  );
}

export function Price({ amount, currency = "$", className, ...props }) {
  return (
    <Typography
      variant="price"
      as="span"
      className={cn("", className)}
      {...props}
    >
      {currency}
      {typeof amount === "number" ? amount.toFixed(2) : amount}
    </Typography>
  );
}

export function SalePrice({
  originalPrice,
  salePrice,
  currency = "$",
  showDiscount = true,
  ...props
}) {
  const discountPercentage = Math.round(
    ((originalPrice - salePrice) / originalPrice) * 100
  );

  return (
    <div className="flex items-center gap-2" {...props}>
      <Typography variant="sale-price" as="span">
        {currency}
        {typeof salePrice === "number" ? salePrice.toFixed(2) : salePrice}
      </Typography>
      <Typography variant="muted" as="span" className="line-through">
        {currency}
        {typeof originalPrice === "number"
          ? originalPrice.toFixed(2)
          : originalPrice}
      </Typography>
      {showDiscount && (
        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
          {discountPercentage}% OFF
        </span>
      )}
    </div>
  );
}
