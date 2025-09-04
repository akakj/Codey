"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import rawData from "@/app/data/neetcode_150_problems.json";
import type { ProblemsFile, ProblemLite } from "@/lib/problem";
import { ThemeToggle } from "../ThemeToggle";
import { getDifficulty } from "@/lib/difficulty";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, List, Search, Funnel } from "lucide-react";
import { SortableHeader } from "@/app/components/SortableHeader";

export default function ProblemTopBar({
  currentSlug,
  user,
}: {
  currentSlug: string;
  user: any | null;
}) {
  const data = rawData as ProblemsFile;

  const problems: ProblemLite[] = useMemo(
    () =>
      data.problems.map((p) => ({
        problemID: p.problemID,
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
      })),
    [data]
  );

  const index = useMemo(
    () => problems.findIndex((p) => p.slug === currentSlug),
    [problems, currentSlug]
  );

  const prev = index > 0 ? problems[index - 1] : null;
  const next =
    index >= 0 && index < problems.length - 1 ? problems[index + 1] : null;

  const difficulties = ["Easy", "Medium", "Hard"] as const;
  type Difficulty = (typeof difficulties)[number];

  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Difficulty[]>([]);
  const [sort, setSort] = useState("");

  const handleSortClick = (type: "alpha" | "difficulty") => {
    const asc = `${type}-asc`;
    const desc = `${type}-desc`;
    setSort((s) => (s === "" ? asc : s === asc ? desc : ""));
  };

  const filteredSorted = useMemo(() => {
    let list = problems;
    const s = q.trim().toLowerCase();
    if (s)
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s)
      );

    if (filters.length)
      list = list.filter((p) => filters.includes(p.difficulty as Difficulty));
    if (sort) {
      const order: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
      if (sort === "alpha-asc")
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
      if (sort === "alpha-desc")
        list = [...list].sort((a, b) => b.title.localeCompare(a.title));
      if (sort === "difficulty-asc")
        list = [...list].sort(
          (a, b) => order[a.difficulty] - order[b.difficulty]
        );
      if (sort === "difficulty-desc")
        list = [...list].sort(
          (a, b) => order[b.difficulty] - order[a.difficulty]
        );
    }
    return list;
  }, [problems, q, filters, sort]);

  return (
    <nav className="fixed top-0 inset-x-0 bg-white dark:bg-[#111111] shadow-sm h-16 z-50 flex items-center justify-between px-4 rounded-b-sm">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex-shrink-0" aria-label="Home">
          <Image
            src="/home-icon.png"
            alt="Home"
            width={32}
            height={32}
            priority
          />
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <button className="text-gray-600 hover:text-gray-900 dark:text-[#c9c6c5] dark:hover:text-white transition-colors inline-flex items-center gap-2 hover:cursor-pointer">
              <List className="h-4 w-4" />
              <span>Problem List</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-[100vw] max-w-none sm:max-w-none sm:w-[90vw] md:w-[75vw] lg:w-[60vw]"
          >
            <SheetHeader className="px-4 pt-3 pb-0 -mb-3">
              <SheetTitle className="text-xl font-bold">
                Problem List
              </SheetTitle>
            </SheetHeader>

            <div className="px-3 py-2 border-b">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search for a problem..."
                    className="h-9 pl-8 pr-2 rounded-xl text-sm w-full max-w-[360px]"
                  />
                </div>
              </div>
            </div>

            {/* Table container */}
            <div className="px-4 py-3">
              <div className="overflow-hidden rounded-md border border-border">
                <div className="max-h-[calc(100vh-11rem)] overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-gray-300 dark:bg-[#22272d]">
                      <tr>
                        <SortableHeader
                          type="alpha"
                          label="Problem"
                          sort={sort}
                          onSortClick={handleSortClick}
                        />
                        <SortableHeader
                          type="difficulty"
                          label="Difficulty"
                          sort={sort}
                          onSortClick={handleSortClick}
                          mobileHide="hidden sm:table-cell"
                        />
                      </tr>
                    </thead>

                    <tbody>
                      {filteredSorted.map((p) => {
                        const diffClass = getDifficulty(p.difficulty);
                        const isCurrent = p.slug === currentSlug;
                        return (
                          <tr
                            key={p.slug}
                            className={cn(
                              "hover:bg-muted/50",
                              isCurrent &&
                                "bg-gray-900 text-white dark:bg-white dark:text-black"
                            )}
                          >
                            <td className="px-4 py-2">
                              <Link
                                href={`/problems/${p.slug}`}
                                className="block truncate font-medium"
                              >
                                {p.title}
                              </Link>
                            </td>
                            <td
                              className={cn(
                                "px-4 py-2 text-xs font-semibold hidden sm:table-cell",
                                diffClass
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
            </div>
          </SheetContent>
        </Sheet>

        {/* Prev / Next */}
        <div className="hidden sm:flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            disabled={!prev}
            className="gap-1"
          >
            <Link href={prev ? `/problems/${prev.slug}` : "#"} prefetch>
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden md:inline"></span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            disabled={!next}
            className="gap-1"
          >
            <Link href={next ? `/problems/${next.slug}` : "#"} prefetch>
              <span className="hidden md:inline"></span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {user ? (
          <Link
            href="/account"
            className="text-gray-600 hover:text-gray-900 dark:text-[#c9c6c5] dark:hover:text-white transition-colors"
          >
            Account
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-gray-600 hover:text-gray-900 dark:text-[#c9c6c5] dark:hover:text-white transition-colors"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
