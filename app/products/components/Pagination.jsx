"use client";

import { Button } from "@/components/ui/button";

export function Pagination({ currentPage, totalPages, searchParams }) {
  // Create a reusable function to build page URLs with current filters
  const getPageUrl = (pageNum) => {
    // Start with base URL
    let url = "/products?page=" + pageNum;

    // Add all current filters
    if (searchParams?.search)
      url += `&search=${encodeURIComponent(searchParams.search)}`;
    if (searchParams?.category)
      url += `&category=${encodeURIComponent(searchParams.category)}`;
    if (searchParams?.minPrice)
      url += `&minPrice=${encodeURIComponent(searchParams.minPrice)}`;
    if (searchParams?.maxPrice)
      url += `&maxPrice=${encodeURIComponent(searchParams.maxPrice)}`;
    if (searchParams?.inStock)
      url += `&inStock=${encodeURIComponent(searchParams.inStock)}`;
    if (searchParams?.rating)
      url += `&rating=${encodeURIComponent(searchParams.rating)}`;
    if (searchParams?.sort)
      url += `&sort=${encodeURIComponent(searchParams.sort)}`;

    return url;
  };

  return (
    <nav className="inline-flex" aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        className="rounded-l-md rounded-r-none"
        asChild
        disabled={currentPage <= 1}
      >
        <a href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}>
          &laquo;
        </a>
      </Button>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const pageNum = i + 1;
        const isCurrentPage = pageNum === currentPage;

        return (
          <Button
            key={pageNum}
            variant="outline"
            size="icon"
            className={`rounded-none ${
              isCurrentPage ? "bg-primary text-primary-foreground" : ""
            }`}
            asChild
          >
            <a href={getPageUrl(pageNum)}>{pageNum}</a>
          </Button>
        );
      })}

      {totalPages > 5 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="rounded-none"
            disabled
          >
            ...
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-none"
            asChild
          >
            <a href={getPageUrl(totalPages)}>{totalPages}</a>
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        className="rounded-r-md rounded-l-none"
        asChild
        disabled={currentPage >= totalPages}
      >
        <a href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}>
          &raquo;
        </a>
      </Button>
    </nav>
  );
}
