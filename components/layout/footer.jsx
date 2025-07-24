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
  ArrowRight,
  MapPin,
  Mail,
  PhoneCall,
} from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 py-6 sm:py-8 mb-6">
          {[
            {
              icon: <Truck className="h-5 w-5 sm:h-6 sm:w-6" />,
              title: "Fast Delivery",
              description: "Free on orders over $50",
            },
            {
              icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6" />,
              title: "24/7 Support",
              description: "Customer care available",
            },
            {
              icon: <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />,
              title: "Secure Checkout",
              description: "100% protected payments",
            },
            {
              icon: <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />,
              title: "Easy Returns",
              description: "30-day return policy",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-3 sm:p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-2 sm:p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2 sm:mb-3">
                {feature.icon}
              </div>
              <h4 className="font-semibold text-sm sm:text-base mb-1">
                {feature.title}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mb-8 sm:mb-12 py-6 sm:py-8 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Stay updated with new offers
              </h3>
              <p className="text-sm sm:text-base text-blue-100">
                Subscribe to our newsletter for exclusive deals and updates
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none flex-grow focus:outline-none text-sm sm:text-base"
              />
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none flex items-center justify-center transition-colors text-sm sm:text-base">
                Subscribe
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 py-6 sm:py-10">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center rounded-xl shadow-sm">
                <span className="text-base sm:text-lg font-bold text-white">
                  E
                </span>
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-lg sm:text-xl font-montserrat font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight">
                  Ecomm
                </span>
                <span className="text-xs font-poppins text-gray-500 dark:text-gray-400 -mt-1">
                  Premium Shopping
                </span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              Shop the latest trends with confidence. Quality products, fast
              shipping, and exceptional customer service.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  123 Commerce St, Shopping City, SC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm">support@ecomm.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneCall className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm">+1 (234) 567-8900</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <a
                href="#"
                className="p-2 rounded-full bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
              >
                <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
              >
                <Twitter size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
              >
                <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
              >
                <Youtube size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-5 text-gray-900 dark:text-white">
              Shop
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                "All Products",
                "New Arrivals",
                "Best Sellers",
                "Deals & Offers",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/products"
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-5 text-gray-900 dark:text-white">
              Categories
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {["Electronics", "Fashion", "Home & Kitchen", "Beauty"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/products"
                      className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-5 text-gray-900 dark:text-white">
              Support
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: "Help Center", href: "/help" },
                { name: "Shipping", href: "/shipping" },
                { name: "Returns", href: "/returns" },
                { name: "Contact Us", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-5 text-gray-900 dark:text-white">
              Policy
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Refund Policy", href: "/refund" },
                { name: "Cookie Policy", href: "/cookies" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 sm:pt-10 mt-6 sm:mt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                © {year}{" "}
                <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Ecomm
                </span>
                . All rights reserved.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 sm:mt-1.5">
                Designed and developed with{" "}
                <span className="text-red-500">♥</span> for the best shopping
                experience.
              </p>
            </div>

            {/* Payment methods */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-2 sm:gap-3">
              {/* Visa */}
              <div className="flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm h-8 sm:h-10">
                <div className="font-bold text-blue-600">
                  <span className="text-[0.55rem] sm:text-[0.65rem]">VISA</span>
                </div>
              </div>

              {/* Mastercard */}
              <div className="flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm h-8 sm:h-10">
                <div className="flex items-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500 opacity-90"></div>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-400 opacity-90 -ml-1.5 sm:-ml-2"></div>
                </div>
              </div>

              {/* PayPal */}
              <div className="flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm h-8 sm:h-10">
                <div className="font-bold text-xs sm:text-sm">
                  <span className="text-blue-700 dark:text-blue-500">Pay</span>
                  <span className="text-blue-400 dark:text-blue-300">Pal</span>
                </div>
              </div>

              {/* Apple Pay */}
              <div className="flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm h-8 sm:h-10">
                <div className="font-semibold flex items-center">
                  <span className="mr-1 text-gray-900 dark:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="12"
                      viewBox="0 0 384 512"
                      fill="currentColor"
                      className="sm:w-3 sm:h-3.5"
                    >
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                  </span>
                  <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                    Pay
                  </span>
                </div>
              </div>

              {/* Google Pay */}
              <div className="flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm h-8 sm:h-10">
                <div className="font-medium flex items-center text-xs sm:text-sm">
                  <span className="text-blue-600 dark:text-blue-400">G</span>
                  <span className="text-red-500">o</span>
                  <span className="text-yellow-500">o</span>
                  <span className="text-blue-600 dark:text-blue-400">g</span>
                  <span className="text-green-500">l</span>
                  <span className="text-red-500">e</span>
                  <span className="text-gray-800 dark:text-gray-200 ml-0.5 sm:ml-1">
                    Pay
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
