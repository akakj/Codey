// Responsible only for communicating with Supabase

import { createClient } from "@/utils/supabase/server";

import type {
  AnalyticsSourceData,
  ProblemRow,
  ProblemStatusRow,
  SubmissionRow,
} from "./types";

type SupabaseServerClient = Awaited<
  ReturnType<typeof createClient>
>;

const SUBMISSION_PAGE_SIZE = 1000;

async function fetchAllUserSubmissions(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<SubmissionRow[]> {
  const submissions: SubmissionRow[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("submissions")
      .select(`
        id,
        problemId,
        language,
        passed,
        passedCases,
        totalCases,
        activeTimeSeconds,
        createdAt
      `)
      .eq("userId", userId)
      .order("createdAt", {
        ascending: true,
      })
      .order("id", {
        ascending: true,
      })
      .range(
        from,
        from + SUBMISSION_PAGE_SIZE - 1,
      )
      .overrideTypes<
        SubmissionRow[],
        { merge: false }
      >();

    if (error) {
      throw new Error(error.message);
    }

    const page = data ?? [];

    submissions.push(...page);

    if (page.length < SUBMISSION_PAGE_SIZE) {
      return submissions;
    }

    from += SUBMISSION_PAGE_SIZE;
  }
}

export async function fetchAnalyticsData(
  userId: string,
): Promise<AnalyticsSourceData> {
  const supabase = await createClient();

  const [
    submissions,
    statusResult,
    problemsResult,
  ] = await Promise.all([
    fetchAllUserSubmissions(
      supabase,
      userId,
    ),

    supabase
      .from("user_problem_status")
      .select("problemId, completed")
      .eq("userId", userId)
      .overrideTypes<
        ProblemStatusRow[],
        { merge: false }
      >(),

    supabase
      .from("problems")
      .select("id, title, slug, difficulty")
      .overrideTypes<
        ProblemRow[],
        { merge: false }
      >(),
  ]);

  if (statusResult.error) {
    throw new Error(
      statusResult.error.message,
    );
  }

  if (problemsResult.error) {
    throw new Error(
      problemsResult.error.message,
    );
  }

  return {
    submissions,
    statuses: statusResult.data ?? [],
    problems: problemsResult.data ?? [],
  };
}