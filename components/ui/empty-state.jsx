import { cn } from "@/lib/utils";
import { Button } from "./button";
import Link from "next/link";

/**
 * A reusable empty state component to display when no data is available
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLink,
  actionLabel,
  className,
  children,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-lg border bg-muted/30",
        className
      )}
    >
      {/* Icon */}
      {icon && <div className="text-3xl md:text-4xl mb-3">{icon}</div>}

      {/* Title */}
      {title && (
        <h3 className="text-lg md:text-xl font-medium mb-2">{title}</h3>
      )}

      {/* Description */}
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && actionLabel && <Button onClick={action}>{actionLabel}</Button>}

      {/* Action Link */}
      {actionLink && actionLabel && (
        <Button asChild>
          <Link href={actionLink}>{actionLabel}</Link>
        </Button>
      )}

      {/* Additional content */}
      {children}
    </div>
  );
}

/**
 * Specialized product list empty state
 */
export function ProductsEmptyState({
  clearFilters,
  isAdmin = false,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 rounded-lg border bg-muted/30">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
        <h3 className="text-base font-medium">Loading products...</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Please wait while we fetch the products
        </p>
      </div>
    );
  }

  return (
    <EmptyState
      icon="📦"
      title={isAdmin ? "No products found" : "No products match your criteria"}
      description={
        isAdmin
          ? "Get started by creating your first product"
          : "Try adjusting your filters or search terms"
      }
      actionLink={isAdmin ? "/admin/products/new" : undefined}
      actionLabel={isAdmin ? "Add New Product" : undefined}
      action={!isAdmin && clearFilters ? clearFilters : undefined}
    >
      {!isAdmin && clearFilters && (
        <Button onClick={clearFilters} variant="outline">
          Clear All Filters
        </Button>
      )}
    </EmptyState>
  );
}
