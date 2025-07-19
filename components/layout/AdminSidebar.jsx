"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  BarChart,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

const adminLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: <Package className="h-4 w-4 mr-2" />,
    subLinks: [
      { href: "/admin/products", label: "All Products" },
      { href: "/admin/products/new", label: "Add Product" },
    ],
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: <ShoppingBag className="h-4 w-4 mr-2" />,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: <Users className="h-4 w-4 mr-2" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-5 sticky top-0 h-screen overflow-auto font-sans flex flex-col">
      <div className="flex items-center mb-8">
        <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center mr-2">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
          Admin Panel
        </h2>
      </div>

      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-2 px-3">
          Navigation
        </h3>
        <div className="h-px bg-gray-200 dark:bg-gray-700 mb-2"></div>
      </div>

      <nav className="flex flex-col space-y-1">
        {adminLinks.map((link) => (
          <div key={link.href} className="mb-2">
            <Link
              href={link.href}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                pathname === link.href
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </Link>

            {link.subLinks && (
              <div className="pl-6 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 ml-3">
                {link.subLinks.map((subLink) => (
                  <Link
                    key={subLink.href}
                    href={subLink.href}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      pathname === subLink.href
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {subLink.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {isAdmin && (
        <div className="mt-auto pt-6 border-t border-border">
          <div className="flex items-center px-4 py-3 bg-muted rounded-lg">
            <div className="ml-2">
              <p className="text-sm font-medium">
                {session?.user?.name || "Admin User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.email || "admin@example.com"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
