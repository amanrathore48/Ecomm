"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";

const BottomTabNav = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:hidden">
      <div className="flex items-center justify-around h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 min-w-0 text-xs font-medium ${
            pathname === "/"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="mt-1">Home</span>
        </Link>

        <Link
          href="/products"
          className={`flex flex-col items-center justify-center flex-1 min-w-0 text-xs font-medium ${
            pathname === "/products"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Search className="h-6 w-6" />
          <span className="mt-1">Search</span>
        </Link>

        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center flex-1 min-w-0 text-xs font-medium ${
            pathname === "/wishlist"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Heart className="h-6 w-6" />
          <span className="mt-1">Wishlist</span>
        </Link>

        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center flex-1 min-w-0 text-xs font-medium ${
            pathname === "/cart"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="mt-1">Cart</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center flex-1 min-w-0 text-xs font-medium ${
            pathname === "/profile"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <User className="h-6 w-6" />
          <span className="mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomTabNav;
