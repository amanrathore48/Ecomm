"use client";

import { Grid3X3, GridIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ViewToggle({ viewType, onViewChange }) {
  return (
    <div className="flex items-center gap-1 border rounded-md">
      <Button
        variant={viewType === "grid" ? "default" : "ghost"}
        size="icon"
        className="h-9 w-9"
        onClick={() => onViewChange("grid")}
      >
        <GridIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={viewType === "list" ? "default" : "ghost"}
        size="icon"
        className="h-9 w-9"
        onClick={() => onViewChange("list")}
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  );
}
