"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { SortableHeader } from "./SortableHeader";
import SearchBar from "./SearchBar";
import { getDifficulty } from "@/lib/difficulty";
import type { ProblemLite } from "@/lib/problem";
import { cn } from "@/lib/utils";

type SortType = "alpha" | "difficulty";
type SortDirection = "asc" | "desc";
type SortValue = "" | `${SortType}-${SortDirection}`;

type SortColumn = {
  type: SortType;
  label: string;
};

const columns: SortColumn[] = [
  { type: "alpha", label: "Problem" },
  { type: "difficulty", label: "Difficulty" },
];

type ProblemsListProps = {
  problems: ProblemLite[];
};

export default function ProblemsList({ problems }: ProblemsListProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [sort, setSort] = useState<SortValue>("");

  function handleSortClick(type: SortType) {
    const ascendingSort = `${type}-asc` as SortValue;
    const descendingSort = `${type}-desc` as SortValue;

    setSort((currentSort) => {
      // First click, or clicking a different column:
      // start the selected column in ascending order.
      if (
        currentSort !== ascendingSort &&
        currentSort !== descendingSort
      ) {
        return ascendingSort;
      }

      // Second click: descending.
      if (currentSort === ascendingSort) {
        return descendingSort;
      }

      // Third click: reset.
      return "";
    });
  }

  const filtered = useMemo(() => {
    let list = problems;

    if (search) {
      const normalizedSearch = search.toLowerCase();

      list = list.filter((problem) =>
        problem.title.toLowerCase().includes(normalizedSearch),
      );
    }

    if (filters.length > 0) {
      list = list.filter((problem) =>
        filters.includes(problem.difficulty),
      );
    }

    const difficultyOrder: Record<string, number> = {
      Easy: 1,
      Medium: 2,
      Hard: 3,
    };

    switch (sort) {
      case "difficulty-asc":
        return [...list].sort(
          (first, second) =>
            difficultyOrder[first.difficulty] -
            difficultyOrder[second.difficulty],
        );

      case "difficulty-desc":
        return [...list].sort(
          (first, second) =>
            difficultyOrder[second.difficulty] -
            difficultyOrder[first.difficulty],
        );

      case "alpha-asc":
        return [...list].sort((first, second) =>
          first.title.localeCompare(second.title),
        );

      case "alpha-desc":
        return [...list].sort((first, second) =>
          second.title.localeCompare(first.title),
        );

      default:
        return list;
    }
  }, [problems, search, filters, sort]);

  return (
    <div>
      <SearchBar
        search={search}
        filters={filters}
        sort={sort}
        onSearchChange={setSearch}
        onFiltersChange={setFilters}
        onSortChange={(value) => setSort(value as SortValue)}
      />

      <div className="mt-4 mb-10 overflow-hidden rounded-md border border-border">
        <table
          className="
            min-w-full divide-y divide-border
            text-xs
            sm:text-sm
            md:text-base
          "
        >
          <thead className="bg-muted/25 dark:bg-muted/30">
            <tr>
              {columns.map((column) => (
                <SortableHeader
                  key={column.type}
                  type={column.type}
                  label={column.label}
                  sort={sort}
                  onSortClick={handleSortClick}
                />
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((problem) => (
              <tr
                key={problem.problemID}
                className="font-semibold even:bg-muted/20 dark:even:bg-muted/30"
              >
                <td className="px-4 py-3 align-top">
                  <Link
                    href={`/problems/${problem.slug}`}
                    className="block wrap-break-word whitespace-normal text-base hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {problem.title}
                  </Link>
                </td>

                <td
                  className={cn(
                    "whitespace-nowrap px-4 py-3 text-sm font-semibold",
                    getDifficulty(problem.difficulty),
                  )}
                >
                  {problem.difficulty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}