"use client";

import {
  Fragment,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

import { SortableHeader } from "@/app/components/SortableHeader";
import {
  formatDate,
  formatMemory,
  formatRuntime,
  statusClass,
  statusText,
} from "@/app/components/ProblemWorkspace/tabs/submissions/submissionUtils";
import { getDifficulty } from "@/lib/difficulty";
import { cn } from "@/lib/utils";

export type SubmissionHistoryRow = {
  id: number;
  language: string;
  passed: boolean;
  runtime: number | null;
  memory: number | null;
  createdAt: string;
  passedCases: number | null;
  totalCases: number | null;
};

export type SubmissionHistoryGroup = {
  problemId: number;
  problemTitle: string;
  problemSlug: string | null;
  difficulty: string;
  lastSubmittedAt: string;
  lastPassed: boolean;
  submissions: SubmissionHistoryRow[];
};

// Sorting Options
type SubmissionHistorySortType =
  | "lastSubmitted"
  | "problem"
  | "submissions";

type SubmissionHistorySort =
  | ""
  | `${SubmissionHistorySortType}-asc`
  | `${SubmissionHistorySortType}-desc`;

function formatLastSubmitted(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function compareProblemTitles(
  first: SubmissionHistoryGroup,
  second: SubmissionHistoryGroup,
) {
  return first.problemTitle.localeCompare(second.problemTitle, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function SubmissionCellLink({
  href,
  children,
}: {
  href: string | null;
  children: ReactNode;
}) {
  if (!href) {
    return <div className="p-3">{children}</div>;
  }

  return (
    <Link href={href} className="block p-3">
      {children}
    </Link>
  );
}

export default function SubmissionHistoryTable({
  groups,
}: {
  groups: SubmissionHistoryGroup[];
}) {
  const [sort, setSort] = useState<SubmissionHistorySort>("");

  const [expandedProblemIds, setExpandedProblemIds] = useState<Set<number>>(
    new Set(),
  );

  const sortedGroups = useMemo(() => {
    const list = [...groups];

    switch (sort) {
      case "lastSubmitted-asc":
        return list.sort(
          (first, second) =>
            new Date(first.lastSubmittedAt).getTime() -
            new Date(second.lastSubmittedAt).getTime(),
        );

      case "lastSubmitted-desc":
        return list.sort(
          (first, second) =>
            new Date(second.lastSubmittedAt).getTime() -
            new Date(first.lastSubmittedAt).getTime(),
        );

      case "problem-asc":
        return list.sort(compareProblemTitles);

      case "problem-desc":
        return list.sort(
          (first, second) => compareProblemTitles(second, first),
        );

      case "submissions-asc":
        return list.sort(
          (first, second) =>
            first.submissions.length - second.submissions.length,
        );

      case "submissions-desc":
        return list.sort(
          (first, second) =>
            second.submissions.length - first.submissions.length,
        );

      default:
        return list;
    }
  }, [groups, sort]);

  function handleSortClick(type: SubmissionHistorySortType) {
    const ascendingSort =
      `${type}-asc` as SubmissionHistorySort;

    const descendingSort =
      `${type}-desc` as SubmissionHistorySort;

    setSort((currentSort) => {
      // First click: ascending.
      if (currentSort !== ascendingSort && currentSort !== descendingSort) {
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

  function toggleProblem(problemId: number) {
    setExpandedProblemIds((currentProblemIds) => {
      const nextProblemIds = new Set(currentProblemIds);

      if (nextProblemIds.has(problemId)) {
        nextProblemIds.delete(problemId);
      } else {
        nextProblemIds.add(problemId);
      }

      return nextProblemIds;
    });
  }

  return (
    <div className="mt-4 mb-10 overflow-hidden rounded-md border border-border">
      <div className="overflow-x-auto">
        <table
  className="
    w-full min-w-175 divide-y divide-border
    text-xs
    sm:text-sm
    md:text-base
  "
>
          <thead className="bg-muted/25 dark:bg-muted/30">
            <tr>
              <SortableHeader
                type="lastSubmitted"
                label="Last Submitted"
                sort={sort}
                onSortClick={handleSortClick}
              />

              <SortableHeader
                type="problem"
                label="Problem"
                sort={sort}
                onSortClick={handleSortClick}
              />

              <th
                scope="col"
                className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Last Result
              </th>

              <SortableHeader
                type="submissions"
                label="Submissions"
                sort={sort}
                onSortClick={handleSortClick}
              />
            </tr>
          </thead>

          <tbody>
            {sortedGroups.map((group) => {
              const isExpanded = expandedProblemIds.has(group.problemId);

              const problemHref = group.problemSlug
                ? `/problems/${group.problemSlug}`
                : null;

              return (
                <Fragment key={group.problemId}>
                  <tr className="border-t transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      {formatLastSubmitted(group.lastSubmittedAt)}
                    </td>

                    <td className="px-4 py-3">
                      {problemHref ? (
                        <Link
                          href={problemHref}
                          className="font-semibold hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          {group.problemTitle}
                        </Link>
                      ) : (
                        <div className="font-semibold">
                          {group.problemTitle}
                        </div>
                      )}

                      <div
                        className={cn(
                          "mt-1 text-xs font-semibold",
                          getDifficulty(group.difficulty),
                        )}
                      >
                        {group.difficulty}
                      </div>
                    </td>

                    <td
                      className={cn(
                        "px-4 py-3 font-semibold",
                        statusClass(group.lastPassed),
                      )}
                    >
                      {statusText(group.lastPassed)}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleProblem(group.problemId)}
                        aria-expanded={isExpanded}
                        aria-label={
                          isExpanded
                            ? `Hide submissions for ${group.problemTitle}`
                            : `Show submissions for ${group.problemTitle}`
                        }
                        className="inline-flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted hover:cursor-pointer"
                      >
                        <span>{group.submissions.length}</span>

                        {isExpanded ? (
                          <ChevronUp
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDown
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </td>
                  </tr>

                  {isExpanded ? (
                    <tr className="border-t">
                      <td colSpan={4} className="p-0">
                        <div className="bg-muted/10 p-3">
                          <div className="overflow-x-auto rounded-md border border-border">
                            <table className="w-full min-w-162.5 text-sm">
                              <thead className="bg-muted/25 dark:bg-muted/30">
                                <tr>
                                  <th className="px-4 py-2 text-left font-medium">
                                    Date
                                  </th>

                                  <th className="px-4 py-2 text-left font-medium">
                                    Result
                                  </th>

                                  <th className="px-4 py-2 text-left font-medium">
                                    Language
                                  </th>

                                  <th className="px-4 py-2 text-left font-medium">
                                    Runtime
                                  </th>

                                  <th className="px-4 py-2 text-left font-medium">
                                    Memory
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {group.submissions.map((submission) => {
                                  const submissionHref = group.problemSlug
                                    ? `/problems/${group.problemSlug}?tab=submissions&submissionId=${submission.id}`
                                    : null;

                                  return (
                                    <tr
                                      key={submission.id}
                                      className="border-t transition-colors hover:bg-muted/30"
                                    >
                                      <td>
                                        <SubmissionCellLink
                                          href={submissionHref}
                                        >
                                          {formatDate(submission.createdAt)}
                                        </SubmissionCellLink>
                                      </td>

                                      <td>
                                        <SubmissionCellLink
                                          href={submissionHref}
                                        >
                                          <div
                                            className={cn(
                                              "font-semibold",
                                              statusClass(submission.passed),
                                            )}
                                          >
                                            {statusText(submission.passed)}
                                          </div>

                                          {submission.passedCases !== null &&
                                          submission.totalCases !== null ? (
                                            <div className="text-xs text-muted-foreground">
                                              {submission.passedCases} /{" "}
                                              {submission.totalCases} test cases
                                            </div>
                                          ) : null}
                                        </SubmissionCellLink>
                                      </td>

                                      <td>
                                        <SubmissionCellLink
                                          href={submissionHref}
                                        >
                                          {submission.language}
                                        </SubmissionCellLink>
                                      </td>

                                      <td>
                                        <SubmissionCellLink
                                          href={submissionHref}
                                        >
                                          {formatRuntime(submission.runtime)}
                                        </SubmissionCellLink>
                                      </td>

                                      <td>
                                        <SubmissionCellLink
                                          href={submissionHref}
                                        >
                                          {formatMemory(submission.memory)}
                                        </SubmissionCellLink>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}