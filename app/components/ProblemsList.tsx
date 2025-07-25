'use client';
import React, { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import { cn } from "@/lib/utils";
import { getDifficulty } from "@/lib/difficulty";


interface Problem {
  problemID: number;
  title: string;
  difficulty: string;
}

interface ProblemsListProps {
  problems: Problem[];
}

export default function ProblemsList({ problems }: ProblemsListProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [sort, setSort] = useState("");

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

      <ul>
        {filtered.map((p) => {
          const colorClass = getDifficulty(p.difficulty);

          return (
            <li
              key={p.problemID}
              className="mb-2 border-b pb-2 flex justify-between items-center"
            >
              <span className="font-semibold text-lg">{p.title}</span>
              <span className={cn("text-sm font-medium", colorClass)}>
                {p.difficulty}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  );
}
