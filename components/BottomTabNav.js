"use client";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartContext } from "@/stores/useCart";
import { useSession } from "next-auth/react";
import {
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineUser,
} from "react-icons/ai";
import { BsGrid, BsSearch } from "react-icons/bs";
import { motion } from "framer-motion";

const BottomTabNav = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const cartContext = useContext(CartContext);
  const totalQuantity = cartContext?.totalQuantity || 0;
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);

  // Navigation items for bottom tab
  const navItems = [
    {
      name: "Home",
      icon: <AiOutlineHome className="h-6 w-6" />,
      href: "/",
      active: pathname === "/",
    },
    {
      name: "Browse",
      icon: <BsGrid className="h-5 w-5" />,
      href: "/products",
      active: pathname?.includes("/products"),
    },
    {
      name: "Cart",
      icon: <AiOutlineShoppingCart className="h-6 w-6" />,
      href: "/cart",
      active: pathname === "/cart",
      badge: totalQuantity > 0 ? totalQuantity : null,
    },
    {
      name: "Wishlist",
      icon: <AiOutlineHeart className="h-6 w-6" />,
      href: "/wishlist",
      active: pathname === "/wishlist",
    },
    {
      name: "Account",
      icon: <AiOutlineUser className="h-6 w-6" />,
      href: status === "authenticated" ? "/profile" : "/signin",
      active: pathname?.includes("/profile") || pathname === "/signin",
    },
  ];

  // Handle scroll direction to hide/show bottom nav when scrolling down/up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.div
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50"
      initial={{ y: 0 }}
      animate={{ y: scrollDirection === "down" ? 100 : 0 }}
      transition={{ duration: 0.3 }}
      style={{
        boxShadow: "0px -2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex justify-around items-center py-2 px-1">
        {navItems.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            className="flex flex-col items-center justify-center w-full relative"
          >
            <motion.div
              className={`flex flex-col items-center justify-center`}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative">
                <div
                  className={`flex items-center justify-center p-1.5 rounded-full ${
                    item.active
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.icon}

                  {/* Badge for cart if needed */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-medium mt-1 text-center block ${
                    item.active
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.name}
                </span>
              </div>

              {item.active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-2 h-1 w-10 bg-blue-500 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomTabNav;
