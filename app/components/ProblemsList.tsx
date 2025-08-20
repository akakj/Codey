'use client';
import React, { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import { cn } from "@/lib/utils";
import { ProblemsFile } from "@/lib/problem";
import { getDifficulty } from "@/lib/difficulty";
import { SortableHeader } from "./SortableHeader";
import Link from "next/link";

export default function ProblemsList({ problems }: ProblemsFile) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [sort, setSort] = useState("");

  type SortColumn = { type: 'alpha' | 'difficulty'; label: string };
  const columns: SortColumn[] = [
    { type: 'alpha',      label: 'Problem'    },
    { type: 'difficulty', label: 'Difficulty' },
  ];

  const handleSortClick = (type: 'alpha' | 'difficulty') => {
    const asc = `${type}-asc`;
    const desc = `${type}-desc`;
    if (sort === '') {
      setSort(asc);
    } else if (sort === asc) {
      setSort(desc);
    } else {
      setSort('');
    }
  };

  const filtered = useMemo(() => {
    let list = problems;

    // search by title
    if (search) {
      list = list.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // filter by selected difficulties
    if (filters.length > 0) {
      list = list.filter((p) => filters.includes(p.difficulty));
    }

    // sort
    if (sort) {
      const orderMap: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
      switch (sort) {
        case "difficulty-asc":
          list = [...list].sort(
            (a, b) => orderMap[a.difficulty] - orderMap[b.difficulty]
          );
          break;
        case "difficulty-desc":
          list = [...list].sort(
            (a, b) => orderMap[b.difficulty] - orderMap[a.difficulty]
          );
          break;
        case "alpha-asc":
          list = [...list].sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "alpha-desc":
          list = [...list].sort((a, b) => b.title.localeCompare(a.title));
          break;
      }
    }

    return list;
  }, [problems, search, filters, sort]);

  return (
    <div>
      <SearchBar
        search={search}
        filters={filters}
        sort={sort}
        onSearchChange={setSearch}
        onFiltersChange={setFilters}
        onSortChange={setSort}
      />

      <div className="mt-4 overflow-hidden rounded-md border border-border">
        <table className="min-w-full divide-y divide-border
                  text-xs 
                  sm:text-sm   
                  md:text-base">
          <thead className="bg-muted/25 dark:bg-muted/30">
            <tr>
              {columns.map(col => (
                <SortableHeader
                  key={col.type}
                  type={col.type}
                  label={col.label}
                  sort={sort}
                  onSortClick={handleSortClick}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const colorClass = getDifficulty(p.difficulty);
              return (
                <tr
                  key={p.problemID}
                  className="even:bg-muted/20 dark:even:bg-muted/30 font-semibold"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link href={`/problems/${p.slug}`} className="hover:text-blue-700 dark:hover:text-blue-300">
                      {p.title}
                    </Link>
                    </td>
                  <td
                    className={cn(
                      "px-4 py-3 whitespace-nowrap text-sm font-semibold",
                      colorClass
                    )}
                  >
                    {p.difficulty}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}