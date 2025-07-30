'use client';
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getDifficulty } from "@/lib/difficulty";
import { Input } from "@/components/ui/input";
import { TbSearch } from "react-icons/tb";

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
  onSearchChange,
  onFiltersChange,
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
      {/* search input with icon */}
      <div className="relative w-full max-w-[350px] mr-4">
        <TbSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search for a problem..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full border rounded-xl pl-10 pr-2 py-1 ui-elements"
        />
      </div>


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

      
    </div>
  );
}
