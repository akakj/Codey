"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

interface SortableHeaderProps<T extends string> {
  type: T;
  label: string;
  sort: string;
  onSortClick: (type: T) => void;
  mobileHide?: string;
}

export function SortableHeader<T extends string>({
  type,
  label,
  sort,
  onSortClick,
  mobileHide,
}: SortableHeaderProps<T>) {
  const ascKey = `${type}-asc`;
  const descKey = `${type}-desc`;

  const isAsc = sort === ascKey;
  const isDesc = sort === descKey;

  const activeClass = "text-black dark:text-gray-100";
  const inactiveClass = "text-gray-500 dark:text-gray-400";

  return (
    <th
      scope="col"
      aria-sort={
        isAsc ? "ascending" : isDesc ? "descending" : "none"
      }
      className={cn(
        "p-0 text-left text-sm font-medium text-gray-600 dark:text-gray-400",
        mobileHide,
      )}
    >
      <button
        type="button"
        onClick={() => onSortClick(type)}
        className="flex w-full cursor-pointer select-none items-center gap-1 px-4 py-2 text-left"
      >
        <span>{label}</span>

        <span className="flex flex-col" aria-hidden="true">
          <ChevronUp
            className={cn(
              "h-3 w-3",
              isAsc ? activeClass : inactiveClass,
            )}
          />

          <ChevronDown
            className={cn(
              "h-3 w-3",
              isDesc ? activeClass : inactiveClass,
            )}
          />
        </span>
      </button>
    </th>
  );
}