"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import useCartStore from "@/stores/zustand-cart";

const Header = () => {
  const { data: session, status } = useSession();
  const { items } = useCartStore();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const searchTimeout = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Define navigation links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "New Arrivals", path: "/products?sort=newest" },
    { name: "Deals", path: "/products?discount=true" },
    { name: "Categories", path: "/categories" },
  ];

  // Check if user is admin
  const isAdmin = session?.user?.role === "admin";

  // Debug session in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Session status:", status);
      console.log("User role:", session?.user?.role);
      console.log("Is admin?", isAdmin);
    }
  }, [session, status, isAdmin]);

  // Handle mounted state for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync search query with URL parameters when on products listing page only
  useEffect(() => {
    // Only run this logic on the exact products listing page, not product detail pages
    if (pathname === "/products") {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get("search");
      if (searchParam) {
        setSearchQuery(searchParam);
      } else {
        setSearchQuery("");
      }
    }
  }, [pathname]);

  // Handle click outside of user menu dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle debounced search
  const performSearch = (query) => {
    // Don't redirect when on a product detail page - check pathname pattern
    if (pathname.match(/^\/products\/[^\/]+$/)) {
      console.log("Search from product detail page - not redirecting");
      return;
    }

    // If we're already on the products listing page, preserve other search parameters
    if (pathname === "/products") {
      // Get current URL search params
      const url = new URL(window.location.href);
      const params = url.searchParams;

      // If query is empty or less than 2 chars, remove the search parameter completely
      if (!query || query.trim().length < 2) {
        params.delete("search");
      } else {
        // Otherwise set the search parameter
        params.set("search", query);
      }

      // Reset to page 1 when changing search
      params.set("page", "1");

      // Navigate with all parameters preserved
      router.push(`/products?${params.toString()}`, { scroll: false });
    } else if (query && query.trim().length >= 2) {
      // If not on products page and has valid search query, navigate to products with search
      router.push(`/products?search=${query}`);
    }
    // Remove the automatic redirect to products page when query is empty
  };

  // Update debounced search when search query changes
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set a new timeout for debouncing (300ms)
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    // Cleanup timeout on component unmount
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  // Perform search when debounced search query changes
  useEffect(() => {
    // Skip search redirects on product detail pages
    if (pathname.match(/^\/products\/[^\/]+$/)) {
      console.log("Skipping search redirect on product detail page");
      return;
    }

    // Only perform search when on products listing page or when search query is valid
    if (
      pathname === "/products" ||
      (debouncedSearchQuery && debouncedSearchQuery.trim().length >= 2)
    ) {
      performSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, pathname]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();

    // Skip redirects on product detail pages
    if (pathname.match(/^\/products\/[^\/]+$/)) {
      console.log(
        "Search form submitted on product detail page - not redirecting"
      );
      return;
    }

    if (searchQuery && searchQuery.trim().length >= 2) {
      performSearch(searchQuery);
    } else if (pathname === "/products") {
      // If on products listing page with empty query, just clear search parameter
      const url = new URL(window.location.href);
      const params = url.searchParams;
      params.delete("search");
      router.push(`/products?${params.toString()}`, { scroll: false });
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    setIsUserMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 z-40 w-full ${
        isScrolled
          ? "shadow-md bg-white dark:bg-gray-900"
          : "bg-white dark:bg-gray-900"
      } transition-all duration-300`}
    >
      <div className="container mx-auto px-4 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center rounded-xl shadow-sm">
                <span className="text-lg font-bold text-white">E</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-montserrat font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight">
                  Ecomm
                </span>
                <span className="text-xs font-poppins text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">
                  Premium Shopping
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 mx-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  pathname === link.path
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
                }`}
              >
                {link.name}
                {pathname === link.path && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 dark:bg-blue-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}

            {/* Admin Dashboard Link - Only visible for admin users */}
            {/* {status === "authenticated" && isAdmin && (
              <Link
                href="/admin"
                className="px-3 py-2 ml-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Dashboard
              </Link>
            )} */}
          </nav>

          {/* Desktop Navigation Actions & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop search - only visible on desktop */}
            <div className="hidden lg:block relative">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="search"
                  name="search"
                  placeholder="Search products..."
                  className="w-48 xl:w-64 pl-9 pr-9 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500 focus:border-blue-300 dark:focus:border-blue-500 dark:text-gray-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => {
                      setSearchQuery("");
                      if (pathname.startsWith("/products")) {
                        const url = new URL(window.location.href);
                        const params = url.searchParams;
                        params.delete("search");
                        router.push(`/products?${params.toString()}`, {
                          scroll: false,
                        });
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </form>
            </div>

            {/* Desktop-only navigation actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/wishlist"
                className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Link>
              <Link
                href="/cart"
                className="group relative p-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 border border-transparent hover:border-gray-200/60 dark:hover:border-gray-700/60"
              >
                {cartCount > 0 && (
                  <span className="absolute -top-0 -right-0 h-4 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-medium flex items-center justify-center ring-1 ring-white dark:ring-gray-900 shadow-md">
                    {cartCount}
                  </span>
                )}
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              </Link>
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`p-2 relative flex items-center ${
                    status === "authenticated"
                      ? isAdmin
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/40"
                        : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30"
                      : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  } rounded-full transition-colors`}
                  aria-haspopup="true"
                  aria-expanded={isUserMenuOpen}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {status === "authenticated" && (
                    <ChevronDown className="ml-1 w-4 h-4" />
                  )}
                  {status === "authenticated" && isAdmin && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  )}
                </button>

                {/* User dropdown menu */}
                <AnimatePresence>
                  {isUserMenuOpen && status === "authenticated" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none z-50"
                    >
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Signed in as
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {session?.user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        {isAdmin ? (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        ) : (
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        )}
                        <Link
                          href="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {isUserMenuOpen && status !== "authenticated" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    >
                      <div className="py-1">
                        <Link
                          href="/signin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Log in
                        </Link>
                        <Link
                          href="/signup"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sign up
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Theme toggle - visible on all screens */}
            <ThemeToggle />

            {/* Mobile menu button - only visible on mobile */}
            <div className="block lg:hidden">
              <button
                onClick={() => {
                  console.log(
                    "Menu button clicked, current state:",
                    isMenuOpen
                  );
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 z-50 lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-y-auto max-h-[calc(100vh-4rem-64px)] shadow-lg"
          >
            <div className="px-4 py-3 space-y-1">
              {/* Mobile search */}
              <div className="mb-3">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="search"
                    name="search"
                    placeholder="Search products..."
                    className="w-full pl-9 pr-16 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500 focus:border-blue-300 dark:focus:border-blue-500 dark:text-gray-100"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </div>

                  {searchQuery && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-10 pr-1 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => {
                        setSearchQuery("");
                        if (pathname.startsWith("/products")) {
                          const url = new URL(window.location.href);
                          const params = url.searchParams;
                          params.delete("search");
                          router.push(`/products?${params.toString()}`, {
                            scroll: false,
                          });
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}

                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      performSearch(searchQuery);
                      if (searchQuery.length >= 2) {
                        setIsMenuOpen(false);
                      }
                    }}
                  >
                    <span className="sr-only">Search</span>
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </button>
                </form>
              </div>

              {/* User info and auth buttons for mobile menu */}
              {status === "authenticated" ? (
                <>
                  <div className="px-3 py-2 mb-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                    Signed in as{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {session?.user?.email}
                    </span>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="px-3 py-3 mb-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShieldCheck className="h-5 w-5" />
                      Admin Dashboard
                    </Link>
                  )}

                  {!isAdmin && (
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      My Profile
                    </Link>
                  )}

                  <Link
                    href="/orders"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    My Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mb-4">
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-2 rounded-md text-base font-medium border border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Navigation links */}
              <div
                className={
                  status === "authenticated"
                    ? "border-t border-gray-100 dark:border-gray-800 pt-2"
                    : ""
                }
              >
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname === link.path
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
