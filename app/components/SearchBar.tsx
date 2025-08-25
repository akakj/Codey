'use client';
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getDifficulty } from "@/lib/difficulty";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Search, Funnel } from 'lucide-react';

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
      <div className="relative w-full max-w-[350px] mr-4">
        <Search
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

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className= "cursor-pointer text-gray-600 dark:text-gray-300 border rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700">
            <Funnel size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          className="w-48 bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-lg"
        >
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Difficulty
          </h3>
          <div className="flex flex-col space-y-2">
            {difficulties.map((d) => {
              const id = `filter-${d.toLowerCase()}`;
              const colorClass = getDifficulty(d as "Easy" | "Medium" | "Hard");
              const checked = filters.includes(d);
              return (
                <div key={d} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={() => toggleDifficulty(d)}
                  />
                  <Label
                    htmlFor={id}
                    className={cn(
                      "cursor-pointer",
                      checked ? colorClass : "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {d}
                  </Label>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
