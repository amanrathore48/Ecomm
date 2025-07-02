import React from "react";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-5 py-12">
        <div className="flex flex-wrap md:text-left text-center">
          {/* Logo & Info Section */}
          <div className="lg:w-1/4 w-full px-4 mb-10 lg:mb-0">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center rounded-xl shadow-sm mr-2">
                  <span className="text-lg font-bold text-white">E</span>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight">
                  Ecomm
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-6 text-gray-500 dark:text-gray-400 text-center md:text-left">
                Your one-stop shop for premium quality products. We offer the
                best selection with excellent customer service.
              </p>
              <div className="flex space-x-4 justify-center md:justify-start">
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-300"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 mb-10 md:mb-0">
            <h2 className="title-font font-semibold text-gray-900 dark:text-gray-100 tracking-wider text-sm mb-4 uppercase">
              Shop
            </h2>
            <nav className="list-none space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Women's Fashion
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Top Deals
                </Link>
              </li>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 mb-10 md:mb-0">
            <h2 className="title-font font-semibold text-gray-900 dark:text-gray-100 tracking-wider text-sm mb-4 uppercase">
              Customer Service
            </h2>
            <nav className="list-none space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Shipping Info
                </Link>
              </li>
            </nav>
          </div>

          {/* Policies */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-semibold text-gray-900 dark:text-gray-100 tracking-wider text-sm mb-4 uppercase">
              Policies
            </h2>
            <nav className="list-none space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Refund Policy
                </Link>
              </li>
            </nav>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-100 dark:bg-gray-950">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center sm:text-left">
            © {currentYear} Ecomm — All Rights Reserved
          </p>
          <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-500 dark:text-gray-400 text-sm">
            Crafted with ♥ for a better shopping experience
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
