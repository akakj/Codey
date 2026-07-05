import Link from "next/link";
import type { Problem } from "@/lib/problem";
import { createClient } from "@/utils/supabase/server";
import SubmissionsCodeViewer from "./SubmissionCodeViewer";

import { MoveLeft } from "lucide-react";

type SubmissionListRow = {
  id: number;
  language: string;
  passed: boolean;
  memory: number | null;
  runtime: number | null;
  createdAt: string;
  passedCases: number | null;
  totalCases: number | null;
};

type SubmissionDetailRow = SubmissionListRow & {
  code: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function formatDateShort(value: string) {
  return new Date(value).toLocaleDateString();
}

function formatRuntime(value: number | null) {
  return value == null ? "N/A" : `${value}ms`;
}

function formatMemory(value: number | null) {
  return value == null ? "N/A" : `${value} KB`;
}

function statusText(passed: boolean) {
  return passed ? "Accepted" : "Wrong Answer";
}

function statusClass(passed: boolean) {
  return passed
    ? "text-green-800 dark:text-green-400"
    : "text-red-800 dark:text-red-400";
}

export default async function Submissions({
  problem,
  selectedSubmissionId,
}: {
  problem: Problem;
  selectedSubmissionId?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="space-y-3 m-2">
        <div className="text-lg font-bold">Submissions</div>
        <div className="rounded-md border p-6">
          <p className="text-sm">Log in to view your submissions</p>
        </div>
      </div>
    );
  }

  const backHref = `/problems/${problem.slug}?tab=submissions`;

  if (selectedSubmissionId) {
    const numericSubmissionId = Number(selectedSubmissionId);

    if (!Number.isInteger(numericSubmissionId)) {
      return (
        <div className="space-y-3 m-2">
          <Link href={backHref} className="text-sm text-muted-foreground">
            <MoveLeft className="h-4 w-4 mr-2" /> All submissions
          </Link>
          <div className="rounded-md border p-6">
            <p className="text-sm text-red-500">Invalid submission.</p>
          </div>
        </div>
      );
    }

    const { data: submission, error } = await supabase
      .from("submissions")
      .select(
        "id, language, passed, memory, runtime, createdAt, code, passedCases, totalCases",
      )
      .eq("id", numericSubmissionId)
      .eq("userId", user.id)
      .eq("problemId", problem.problemID)
      .maybeSingle();

    if (error) {
      return (
        <div className="space-y-3 m-2">
          <Link href={backHref} className="text-sm text-muted-foreground">
            <MoveLeft className="h-4 w-4 mr-2" /> All submissions
          </Link>
          <div className="rounded-md border p-6">
            <p className="text-sm text-red-500">{error.message}</p>
          </div>
        </div>
      );
    }

    if (!submission) {
      return (
        <div className="space-y-3 m-2">
          <Link href={backHref} className="text-sm text-muted-foreground">
            <MoveLeft className="h-4 w-4 mr-2" /> All submissions
          </Link>
          <div className="rounded-md border p-6">
            <p className="text-sm">Submission not found</p>
          </div>
        </div>
      );
    }

    const item = submission as SubmissionDetailRow;

    return (
      <div className="m-2">
        <div>
          <Link
            href={backHref}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <MoveLeft className="h-4 w-4 mr-2" /> All submissions
          </Link>
        </div>

        <div className="pb-4">
          <div className="flex flex-wrap items-end gap-3">
            <h2 className={`text-md font-semibold ${statusClass(item.passed)}`}>
              {statusText(item.passed)}
            </h2>

            {item.passedCases != null && item.totalCases != null ? (
              <p className="text-lg text-muted-foreground">
                {item.passedCases} / {item.totalCases} test cases
              </p>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <span>Submitted at: {formatDate(item.createdAt)}</span>
          </div>
        </div>

        <div className="">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-2">
              <p className="text-sm font-semibold text-muted-foreground">
                Runtime
              </p>
              <p className="mt-4 font-semibold">
                {formatRuntime(item.runtime)}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-2">
              <p className="text-sm font-semibold text-muted-foreground">
                Memory
              </p>
              <p className="mt-4 font-semibold">
                {formatMemory(item.memory)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="mt-3 mb-2 flex items-center gap-3">
            <h3 className="text-lg font-semibold">Code</h3>
            <span className="text-muted-foreground">|</span>
            <span className="text-lg text-muted-foreground">
              {item.language}
            </span>
          </div>

          <SubmissionsCodeViewer code={item.code} language={item.language} />
        </div>
      </div>
    );
  }

  const { data: submissions, error } = await supabase
    .from("submissions")
    .select(
      "id, language, passed, memory, runtime, createdAt, passedCases, totalCases",
    )
    .eq("userId", user.id)
    .eq("problemId", problem.problemID)
    .order("createdAt", { ascending: false });

  if (error) {
    return (
      <div className="space-y-3 m-2">
        <div className="text-lg font-bold">Submissions</div>
        <div className="rounded-md border p-6">
          <p className="text-sm text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 m-2">
      <div className="text-lg font-bold">Submissions</div>

      {!submissions?.length ? (
        <div className="rounded-md border p-6">
          <p className="text-sm">No submissions to show.</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left">Submission</th>
                <th className="p-3 text-left">Language</th>
                <th className="p-3 text-left">Runtime</th>
                <th className="p-3 text-left">Memory</th>
              </tr>
            </thead>

            <tbody>
              {(submissions as SubmissionListRow[]).map((submission) => {
                const href = `/problems/${problem.slug}?tab=submissions&submissionId=${submission.id}`;

                return (
                  <tr
                    key={submission.id}
                    className="border-t hover:bg-muted/40 transition-colors"
                  >
                    <td className="p-3">
                      <Link href={href} className="block">
                        <div
                          className={`font-semibold ${statusClass(
                            submission.passed,
                          )}`}
                        >
                          {statusText(submission.passed)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDateShort(submission.createdAt)}
                        </div>
                      </Link>
                    </td>

                    <td className="p-3">
                      <Link href={href} className="block">
                        {submission.language}
                      </Link>
                    </td>

                    <td className="p-3">
                      <Link href={href} className="block">
                        {formatRuntime(submission.runtime)}
                      </Link>
                    </td>

                    <td className="p-3">
                      <Link href={href} className="block">
                        {formatMemory(submission.memory)}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
