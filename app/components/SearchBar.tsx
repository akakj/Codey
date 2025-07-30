"use client";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getDifficulty } from "@/lib/difficulty";

interface SearchBarProps {
  search: string;
  filters: string[];
  sort: string;
  onSearchChange: (value: string) => void;
  onFiltersChange: (values: string[]) => void;
  onSortChange: (value: string) => void;
}

export default function SearchBar({
  search,
  filters,
  sort,
  onSearchChange,
  onFiltersChange,
  onSortChange,
}: SearchBarProps) {
  const difficulties = ["Easy", "Medium", "Hard"];

  const toggleDifficulty = (d: string) => {
    if (filters.includes(d)) {
      onFiltersChange(filters.filter((f) => f !== d));
    } else {
      onFiltersChange([...filters, d]);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <input
        type="text"
        placeholder="Search for a problem..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border rounded-lg px-2 py-1 flex-grow mr-4 ui-elements"
      />

      <div className="flex items-center space-x-6 mr-4">
        {difficulties.map((d) => {
          const id = `difficulty-${d.toLowerCase()}`;
          const colorClass = getDifficulty(d as "Easy" | "Medium" | "Hard");

          return (
            <div key={d} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={filters.includes(d)}
                onCheckedChange={() => toggleDifficulty(d)}
                className="ui-elements"
              />
              <Label htmlFor={id} className={cn("font-semibold", colorClass)}>
                {d}
              </Label>
            </div>
          );
        })}
      </div>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-32 px-2 py-1 rounded-lg border ui-elements"
      >
        <option value="" disabled hidden>
          Sort By
        </option>
        <option value="">Default</option>
        <option value="difficulty-asc">Difficulty ↑</option>
        <option value="difficulty-desc">Difficulty ↓</option>
        <option value="alpha-asc">Alphabetical (a–z)</option>
        <option value="alpha-desc">Alphabetical (z–a)</option>
      </select>
    </div>
  );
}
