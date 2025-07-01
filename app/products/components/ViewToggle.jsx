"use client";

import { Grid3X3, GridIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ViewToggle() {
  const [viewMode, setViewMode] = useState("grid");

  return (
    <div className="flex items-center gap-1 border rounded-md">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="icon"
        className="h-9 w-9"
        onClick={() => setViewMode("grid")}
      >
        <GridIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "compact" ? "default" : "ghost"}
        size="icon"
        className="h-9 w-9"
        onClick={() => setViewMode("compact")}
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  );
}
