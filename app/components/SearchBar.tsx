'use client';
import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
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
          const colorClass = getDifficulty(d as "Easy"|"Medium"|"Hard");

          return (
            <div key={d} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={filters.includes(d)}
                onCheckedChange={() => toggleDifficulty(d)}
                className="ui-elements"
              />
              <Label
                htmlFor={id}
                className={cn("font-semibold", colorClass)}
              >
                {d}
              </Label>
            </div>
          );
        })}
      </div>

      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[160px] min-w-[100px] px-2 py-1">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent className="w-[var(--radix-select-trigger-width)] rounded-xl">
          <SelectItem value="difficulty-asc">Difficulty ↑</SelectItem>
          <SelectItem value="difficulty-desc">Difficulty ↓</SelectItem>
          <SelectItem value="alpha-asc">Alphabetical (a–z)</SelectItem>
          <SelectItem value="alpha-desc">Alphabetical (z–a)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}