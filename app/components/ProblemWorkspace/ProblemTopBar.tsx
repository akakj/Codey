"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import rawData from "@/app/data/neetcode_150_problems_with_entry.json";
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
import {
  ChevronLeft,
  ChevronRight,
  List,
  Search,
  Shuffle,
  Loader2,
} from "lucide-react";
import { SortableHeader } from "@/app/components/SortableHeader";
import { getRandomUnsolvedProblem } from "@/app/components/ProblemWorkspace/tabs/getRandomUnsolvedProblem";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from "@supabase/supabase-js";

export default function ProblemTopBar({
  currentSlug,
  user,
}: {
  currentSlug: string;
  user: User | null;
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
    [data],
  );

  const index = useMemo(
    () => problems.findIndex((p) => p.slug === currentSlug),
    [problems, currentSlug],
  );

  const prev = problems.length
    ? problems[(index - 1 + problems.length) % problems.length]
    : null;
  const next = problems.length ? problems[(index + 1) % problems.length] : null;

  const [open, setOpen] = useState(false);

  // points to the scrollable div
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // points to the current row
  const currentRowRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (!open) return; // only scroll when opening the sheet

    // wait for sheet content to render
    const id = requestAnimationFrame(() => {
      currentRowRef.current?.scrollIntoView({
        block: "center",
        inline: "nearest",
        behavior: "instant" as ScrollBehavior,
      });
    });

    return () => cancelAnimationFrame(id);
  });

  const [q, setQ] = useState("");
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
          p.title.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s),
      );

    if (sort) {
      const order: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
      if (sort === "alpha-asc")
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
      if (sort === "alpha-desc")
        list = [...list].sort((a, b) => b.title.localeCompare(a.title));
      if (sort === "difficulty-asc")
        list = [...list].sort(
          (a, b) => order[a.difficulty] - order[b.difficulty],
        );
      if (sort === "difficulty-desc")
        list = [...list].sort(
          (a, b) => order[b.difficulty] - order[a.difficulty],
        );
    }
    return list;
  }, [problems, q, sort]);

  const router = useRouter();

  const [isRandomProblemPending, startRandomProblemTransition] =
    useTransition();

  const handleRandomProblem = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    startRandomProblemTransition(async () => {
      try {
        const result = await getRandomUnsolvedProblem(currentSlug);

        if (!result.ok) {
          window.alert(result.message);
          return;
        }

        router.push(`/problems/${result.slug}`);
      } catch (error) {
        console.error("Could not select a random problem:", error);
        window.alert("Could not load a random problem.");
      }
    });
  };

  return (
    <nav className="fixed top-0 inset-x-0 bg-white dark:bg-[#111111] shadow-sm h-16 z-50 flex items-center justify-between px-4 rounded-b-sm">
      <div className="flex items-center space-x-4">
        <Link href="/" className="shrink-0" aria-label="Home">
          <Image
            src="/home-icon.png"
            alt="Home"
            width={32}
            height={32}
            priority
          />
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="text-gray-600 hover:text-gray-900 dark:text-[#c9c6c5] dark:hover:text-white transition-colors inline-flex items-center gap-2 hover:cursor-pointer">
              <List className="h-4 w-4" />
              <span className="text-gray-700 dark:text-gray-300">
                Problem List
              </span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-screen max-w-none sm:max-w-none sm:w-[90vw] md:w-[70vw] lg:w-[50vw]"
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
                    className="h-9 pl-8 pr-2 rounded-xl text-sm w-full max-w-90"
                  />
                </div>
              </div>
            </div>

            {/* Table container */}
            <div className="px-4 py-3">
              <div className="overflow-hidden rounded-md border border-border">
                <div
                  className="max-h-[calc(100vh-11rem)] overflow-auto"
                  ref={scrollRef}
                >
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
                            ref={isCurrent ? currentRowRef : null}
                            className={cn(
                              "hover:bg-muted/70",
                              isCurrent &&
                                "bg-gray-900 text-white dark:bg-white dark:text-black",
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
                                diffClass,
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="sm"
                disabled={!prev}
                className="gap-1 cursor-pointer"
              >
                <Link
                  href={prev ? `/problems/${prev.slug}` : "#"}
                  prefetch
                  aria-label="Previous problem"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>

            <TooltipContent
              side="bottom"
              sideOffset={6}
              className="rounded-xl px-3 py-2"
            >
              Previous problem
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="sm"
                disabled={!next}
                className="gap-1 cursor-pointer"
              >
                <Link
                  href={next ? `/problems/${next.slug}` : "#"}
                  prefetch
                  aria-label="Next problem"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>

            <TooltipContent
              side="bottom"
              sideOffset={6}
              className="rounded-xl px-3 py-2"
            >
              Next problem
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRandomProblem}
                disabled={isRandomProblemPending}
                aria-label="Open a random unsolved problem"
                className="gap-2 cursor-pointer"
              >
                {isRandomProblemPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shuffle className="h-4 w-4" />
                )}

                <span className="hidden lg:inline">
                  {isRandomProblemPending ? "Finding..." : ""}
                </span>
              </Button>
            </TooltipTrigger>

            <TooltipContent
              side="bottom"
              sideOffset={6}
              className="rounded-xl px-3 py-2"
            >
              Open a random unsolved problem
            </TooltipContent>
          </Tooltip>
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
