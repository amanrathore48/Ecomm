"use client";

import { Shield, User } from "lucide-react";

export function RoleBadge({ role, size = "default" }) {
  const isAdmin = role === "admin";

  const sizeClasses = {
    small: "text-[10px] px-1.5 py-0.5",
    default: "text-xs px-2.5 py-0.5",
    large: "text-sm px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        sizeClasses[size]
      } ${
        isAdmin
          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
          : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
      }`}
    >
      {isAdmin ? (
        <>
          <Shield
            className={`${
              size === "small"
                ? "w-2.5 h-2.5"
                : size === "large"
                ? "w-4 h-4"
                : "w-3 h-3"
            } mr-1`}
          />
          Admin
        </>
      ) : (
        <>
          <User
            className={`${
              size === "small"
                ? "w-2.5 h-2.5"
                : size === "large"
                ? "w-4 h-4"
                : "w-3 h-3"
            } mr-1`}
          />
          User
        </>
      )}
    </span>
  );
}
