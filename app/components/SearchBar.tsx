"use client";

import React from "react";
import { Search, Funnel } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDifficulty } from "@/lib/difficulty";

interface SearchBarProps {
  search: string;
  filters: string[];
  completionFilters: string[];
  sort: string;
  onSearchChange: (value: string) => void;
  onFiltersChange: (values: string[]) => void;
  onCompletionFiltersChange: (values: string[]) => void;
  onSortChange: (value: string) => void;
}

export default function SearchBar({
  search,
  filters,
  completionFilters,
  onSearchChange,
  onFiltersChange,
  onCompletionFiltersChange,
}: SearchBarProps) {
  const difficulties = ["Easy", "Medium", "Hard"];
  const completionOptions = ["Completed", "Uncompleted"];

  const toggleDifficulty = (difficulty: string) => {
    if (filters.includes(difficulty)) {
      onFiltersChange(
        filters.filter((filter) => filter !== difficulty),
      );
    } else {
      onFiltersChange([...filters, difficulty]);
    }
  };

  const toggleCompletion = (completionStatus: string) => {
    if (completionFilters.includes(completionStatus)) {
      onCompletionFiltersChange(
        completionFilters.filter(
          (filter) => filter !== completionStatus,
        ),
      );
    } else {
      onCompletionFiltersChange([
        ...completionFilters,
        completionStatus,
      ]);
    }
  };

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="relative mr-4 w-full max-w-87.5">
        <Search
          className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400 dark:text-gray-500"
          size={20}
        />

        <Input
          type="text"
          placeholder="Search for a problem..."
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          className="ui-elements w-full rounded-xl border py-1 pr-2 pl-10"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Filter problems"
            className="cursor-pointer rounded-lg border text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-700"
          >
            <Funnel size={20} />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          side="bottom"
          className="w-52 rounded-xl bg-gray-100 p-4 shadow-lg dark:bg-slate-800"
        >
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Difficulty
          </h3>

          <div className="flex flex-col space-y-2">
            {difficulties.map((difficulty) => {
              const id = `filter-${difficulty.toLowerCase()}`;
              const colorClass = getDifficulty(
                difficulty as "Easy" | "Medium" | "Hard",
              );
              const checked = filters.includes(difficulty);

              return (
                <div
                  key={difficulty}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={() =>
                      toggleDifficulty(difficulty)
                    }
                  />

                  <Label
                    htmlFor={id}
                    className={cn(
                      "cursor-pointer",
                      checked
                        ? colorClass
                        : "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    {difficulty}
                  </Label>
                </div>
              );
            })}
          </div>

          <div className="my-4 border-t border-border" />

          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Completion
          </h3>

          <div className="flex flex-col space-y-2">
            {completionOptions.map((completionStatus) => {
              const id = `filter-${completionStatus.toLowerCase()}`;
              const checked =
                completionFilters.includes(completionStatus);

              return (
                <div
                  key={completionStatus}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={() =>
                      toggleCompletion(completionStatus)
                    }
                  />

                  <Label
                    htmlFor={id}
                    className={cn(
                      "cursor-pointer",
                      checked && completionStatus === "Completed"
                        ? "text-green-700 dark:text-green-400"
                        : "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    {completionStatus}
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