'use client';
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableHeaderProps {
  type: 'alpha' | 'difficulty';
  label: string;
  sort: string;
  onSortClick: (type: 'alpha' | 'difficulty') => void;
}

export function SortableHeader({ type, label, sort, onSortClick }: SortableHeaderProps) {
  const ascKey = `${type}-asc`;
  const descKey = `${type}-desc`;
  const isAsc = sort === ascKey;
  const isDesc = sort === descKey;

  const activeClass = 'text-black dark:text-gray-100';
  const inactiveClass = 'text-gray-500 dark:text-gray-400';

  return (
    <th
      onClick={() => onSortClick(type)}
      className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer select-none"
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <div className="flex flex-col">
          <ChevronUp className={cn('h-3 w-3', isAsc ? activeClass : inactiveClass)} />
          <ChevronDown className={cn('h-3 w-3', isDesc ? activeClass : inactiveClass)} />
        </div>
      </div>
    </th>
  );
}
