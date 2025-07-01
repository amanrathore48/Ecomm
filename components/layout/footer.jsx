"use client";

import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  CreditCard,
  ShieldCheck,
  Truck,
  Clock,
} from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-10">
        {/* Features Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-b">
          {[
            {
              icon: <Truck className="h-6 w-6" />,
              title: "Free Shipping",
              description: "On orders over $50",
            },
            {
              icon: <Clock className="h-6 w-6" />,
              title: "24/7 Support",
              description: "Customer support",
            },
            {
              icon: <ShieldCheck className="h-6 w-6" />,
              title: "Secure Payment",
              description: "100% secure payment",
            },
            {
              icon: <CreditCard className="h-6 w-6" />,
              title: "Easy Returns",
              description: "30-day return policy",
            },
          ].map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="text-primary">{feature.icon}</div>
              <div>
                <h4 className="font-medium">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8">
          <div className="md:col-span-4">
            <h3 className="text-xl font-bold mb-4">Ecomm.</h3>
            <p className="text-muted-foreground mb-6">
              Shop the latest trends with confidence. Quality products, fast
              shipping, and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/80 hover:text-primary">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground/80 hover:text-primary">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/80 hover:text-primary">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-foreground/80 hover:text-primary">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-foreground/80 hover:text-primary">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary"
                >
                  Deals & Offers
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary"
                >
                  Fashion
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary"
                >
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary"
                >
                  Beauty
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-primary"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-primary"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-primary"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold text-lg mb-4">Policy</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-muted-foreground hover:text-primary"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-primary"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {year} Ecomm. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <img
                src="/payment-visa.svg"
                alt="Visa"
                className="h-6"
                width={40}
                height={24}
              />
              <img
                src="/payment-mastercard.svg"
                alt="Mastercard"
                className="h-6"
                width={40}
                height={24}
              />
              <img
                src="/payment-paypal.svg"
                alt="PayPal"
                className="h-6"
                width={40}
                height={24}
              />
              <img
                src="/payment-apple.svg"
                alt="Apple Pay"
                className="h-6"
                width={40}
                height={24}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
