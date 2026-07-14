"use server";

import rawData from "@/app/data/neetcode_150_problems_with_entry.json";
import type { ProblemsFile } from "@/lib/problem";
import { createClient } from "@/utils/supabase/server";

export type RandomUnsolvedProblemResult =
  | {
      ok: true;
      slug: string;
    }
  | {
      ok: false;
      reason:
        | "unauthenticated"
        | "all-solved"
        | "only-current-unsolved"
        | "database-error";
      message: string;
    };

export async function getRandomUnsolvedProblem(
  currentSlug: string,
): Promise<RandomUnsolvedProblemResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authenticationError,
  } = await supabase.auth.getUser();

  if (authenticationError || !user) {
    return {
      ok: false,
      reason: "unauthenticated",
      message: "Log in to get a random unsolved problem.",
    };
  }

  /*
   * Only fetch completed rows.
   *
   * Problems with:
   *   - completed = false
   *   - no user_problem_status row
   *
   * are both considered unsolved.
   */
  const { data: completedRows, error: statusError } = await supabase
    .from("user_problem_status")
    .select("problemId")
    .eq("userId", user.id)
    .eq("completed", true);

  if (statusError) {
    console.error("Could not load completed problems:", statusError);

    return {
      ok: false,
      reason: "database-error",
      message: "Could not load your problem progress.",
    };
  }

  const completedProblemIds = new Set<number>(
    (completedRows ?? []).map((row) => row.problemId),
  );

  const data = rawData as ProblemsFile;

  const unsolvedProblems = data.problems.filter(
    (problem) => !completedProblemIds.has(problem.problemID),
  );

  if (unsolvedProblems.length === 0) {
    return {
      ok: false,
      reason: "all-solved",
      message: "You have completed every problem.",
    };
  }

  // Prevent the button from selecting the page already being viewed.
  const candidates = unsolvedProblems.filter(
    (problem) => problem.slug !== currentSlug,
  );

  if (candidates.length === 0) {
    return {
      ok: false,
      reason: "only-current-unsolved",
      message: "This is your only remaining unsolved problem.",
    };
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  const selectedProblem = candidates[randomIndex];

  return {
    ok: true,
    slug: selectedProblem.slug,
  };
}