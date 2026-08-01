import type { Metadata } from "next";
import { redirect } from "next/navigation";

import SubmissionHistoryTable, {
  type SubmissionHistoryGroup,
  type SubmissionHistoryRow,
} from "./SubmissionHistoryTable";
import rawData from "@/app/data/neetcode_150_problems_with_entry.json";
import type { ProblemsFile } from "@/lib/problem";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Submission History",
};

type SubmissionDatabaseRow = {
  id: number;
  problemId: number;
  language: string;
  passed: boolean;
  runtime: number | null;
  memory: number | null;
  createdAt: string;
  passedCases: number | null;
  totalCases: number | null;
};

export default async function SubmissionHistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("submissions")
    .select(
      `
        id,
        problemId,
        language,
        passed,
        runtime,
        memory,
        createdAt,
        passedCases,
        totalCases
      `,
    )
    .eq("userId", user.id)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Failed to load submission history:", error);

    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold">Submission History</h1>

        <div className="mt-6 rounded-lg border p-6">
          <p className="text-sm text-red-600 dark:text-red-400">
            Unable to load your submission history.
          </p>
        </div>
      </main>
    );
  }

  const submissions = (data ?? []) as SubmissionDatabaseRow[];
  const { problems } = rawData as ProblemsFile;

  const problemsById = new Map(
    problems.map((problem) => [problem.problemID, problem]),
  );

  const groupsByProblemId = new Map<number, SubmissionHistoryGroup>();

  for (const submission of submissions) {
    const problem = problemsById.get(submission.problemId);

    const submissionRow: SubmissionHistoryRow = {
      id: submission.id,
      language: submission.language,
      passed: submission.passed,
      runtime: submission.runtime,
      memory: submission.memory,
      createdAt: submission.createdAt,
      passedCases: submission.passedCases,
      totalCases: submission.totalCases,
    };

    const existingGroup = groupsByProblemId.get(submission.problemId);

    if (existingGroup) {
      existingGroup.submissions.push(submissionRow);
      continue;
    }

    groupsByProblemId.set(submission.problemId, {
      problemId: submission.problemId,
      problemTitle:
        problem?.title ?? `Unknown problem #${submission.problemId}`,
      problemSlug: problem?.slug ?? null,
      difficulty: problem?.difficulty ?? "Unknown",

      // Submissions arrive newest first, so the first submission
      // encountered for each problem is its latest submission.
      lastSubmittedAt: submission.createdAt,
      lastPassed: submission.passed,

      submissions: [submissionRow],
    });
  }

  const groups = Array.from(groupsByProblemId.values());

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Submission History</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View your attempted problems and all submissions made for each problem
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="font-medium">No submissions yet</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Your submitted solutions will appear here.
          </p>
        </div>
      ) : (
        <SubmissionHistoryTable groups={groups} />
      )}
    </main>
  );
}