'use client';
import React from 'react';
import { Select } from "@/components/ui/select";

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
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const toggleDifficulty = (d: string) => {
    if (filters.includes(d)) {
      onFiltersChange(filters.filter(f => f !== d));
    } else {
      onFiltersChange([...filters, d]);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <input
        type="text"
        placeholder="Search problems…"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="border rounded px-2 py-1 flex-grow mr-4"
      />

      <div className="flex items-center space-x-4 mr-4">
        {difficulties.map(d => (
          <label key={d} className="flex items-center">
            <input
              type="checkbox"
              checked={filters.includes(d)}
              onChange={() => toggleDifficulty(d)}
              className="mr-1"
            />
            {d}
          </label>
        ))}
      </div>

      <select
        value={sort}
        onChange={e => onSortChange(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">Sort By</option>
        <option value="difficulty-asc">Difficulty ↑</option>
        <option value="difficulty-desc">Difficulty ↓</option>
        <option value="alpha-asc">Alphabetical (a-z)</option>
        <option value="alpha-desc">Alphabetical (z-a)</option>
      </select>
    </div>
  );
}
