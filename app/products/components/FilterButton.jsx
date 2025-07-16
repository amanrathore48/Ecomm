"use client";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export function FilterButton() {
  const scrollToFilters = () => {
    document
      .getElementById("filters-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Button
      variant="outline"
      className="lg:hidden flex items-center gap-2"
      onClick={scrollToFilters}
    >
      <SlidersHorizontal className="h-4 w-4" />
      Filters
    </Button>
  );
}
