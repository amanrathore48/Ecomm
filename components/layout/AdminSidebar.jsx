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
    <aside className="w-64 bg-background border-r p-6 sticky top-0 h-screen overflow-auto font-sans">
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-2xl font-serif font-semibold text-primary tracking-tight">
          Admin Panel
        </h2>
      </div>

      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 px-4">
          Navigation
        </h3>
        <div className="h-px bg-border mb-2"></div>
      </div>

      <nav className="flex flex-col space-y-1">
        {adminLinks.map((link) => (
          <div key={link.href} className="mb-2">
            <Link
              href={link.href}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                pathname === link.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground/80 hover:bg-accent hover:text-foreground"
              }`}
            >
              {link.icon}
              <span className="font-serif font-medium">{link.label}</span>
            </Link>

            {link.subLinks && (
              <div className="pl-4 mt-1 space-y-1 border-l border-border ml-4">
                {link.subLinks.map((subLink) => (
                  <Link
                    key={subLink.href}
                    href={subLink.href}
                    className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                      pathname === subLink.href
                        ? "bg-accent text-primary font-medium"
                        : "text-foreground/70 hover:bg-accent/50 hover:text-foreground"
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
