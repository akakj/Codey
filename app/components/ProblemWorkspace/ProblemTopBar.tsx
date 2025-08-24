"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronLeft, ChevronRight, Home, ListOrdered } from "lucide-react";

import problemsJson from "@/app/data/neetcode_150_problems.json";
// If you already have a ProblemsFile type, you can import it and cast:
// import type { ProblemsFile } from "@/lib/problem";
// const data = problemsJson as ProblemsFile;

type ProblemLite = {
  problemID: number;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
};

export default function ProblemTopBar({ currentSlug }: { currentSlug: string }) {
  const router = useRouter();
  const problems = (problemsJson as any).problems as ProblemLite[];

  const idx = useMemo(
    () => problems.findIndex((p) => p.slug === currentSlug),
    [problems, currentSlug]
  );

  const atFirst = idx <= 0;
  const atLast = idx < 0 || idx >= problems.length - 1;

  const goPrev = () => !atFirst && router.push(`/problems/${problems[idx - 1].slug}`);
  const goNext = () => !atLast && router.push(`/problems/${problems[idx + 1].slug}`);

  // Browse overlay state (Dialog can also manage its own state via open/onOpenChange)
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-12 items-center gap-2 px-3 sm:px-4">
        {/* Left cluster: Home + Prev/Next */}
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" aria-label="Home">
            <Link href="/problems">
              <Home className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous problem"
            onClick={goPrev}
            disabled={atFirst}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Next problem"
            onClick={goNext}
            disabled={atLast}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-2 hidden h-6 sm:block" />

        {/* Center: title + index */}
        <div className="min-w-0 flex-1 truncate">
          {idx >= 0 ? (
            <div className="truncate text-sm sm:text-base">
              <span className="font-medium">{problems[idx].title}</span>
              <span className="ml-2 text-muted-foreground">
                {idx + 1} / {problems.length}
              </span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Problem</div>
          )}
        </div>

        <Separator orientation="vertical" className="mx-2 hidden h-6 sm:block" />

        {/* Right: Browse overlay trigger */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <ListOrdered className="h-4 w-4" />
              Browse
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Browse Problems</DialogTitle>
            </DialogHeader>

            <Command shouldFilter>
              <CommandInput placeholder="Search problems..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="All">
                  {problems.map((p, i) => (
                    <CommandItem
                      key={p.slug}
                      onSelect={() => {
                        setOpen(false);
                        router.push(`/problems/${p.slug}`);
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="min-w-0 truncate">
                        <span className="mr-2 text-muted-foreground">{i + 1}.</span>
                        <span className="truncate">{p.title}</span>
                      </div>
                      <span
                        className={[
                          "ml-2 rounded-full px-2 py-0.5 text-xs",
                          p.difficulty === "Easy" && "bg-emerald-500/10 text-emerald-500",
                          p.difficulty === "Medium" && "bg-amber-500/10 text-amber-500",
                          p.difficulty === "Hard" && "bg-rose-500/10 text-rose-500",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {p.difficulty}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
