"use server";

import rawData from "@/app/data/neetcode_150_problems_with_entry.json";
import type { ProblemsFile } from "@/lib/problem";
import { createClient } from "@/utils/supabase/server";
import { isLang, type Lang } from "@/lib/languages";

export type LastSubmittedCodeResult =
  | {
      ok: true;
      code: string;
      language: Lang;
    }
  | {
      ok: false;
      message: string;
    };

export async function getLastSubmittedCode(
  problemSlug: string,
): Promise<LastSubmittedCodeResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authenticationError,
  } = await supabase.auth.getUser();

  if (authenticationError || !user) {
    return {
      ok: false,
      message: "Log in to retrieve your last submitted code.",
    };
  }

  const data = rawData as ProblemsFile;
  const problem = data.problems.find(
    (problem) => problem.slug === problemSlug,
  );

  if (!problem) {
    return {
      ok: false,
      message: "Problem not found.",
    };
  }

  const { data: submission, error } = await supabase
    .from("submissions")
    .select("code, language")
    .eq("userId", user.id)
    .eq("problemId", problem.problemID)
    .order("createdAt", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Could not retrieve last submission:", error);

    return {
      ok: false,
      message: "Could not retrieve your last submitted code.",
    };
  }

  if (!submission) {
    return {
      ok: false,
      message: "You have not submitted a solution for this problem yet.",
    };
  }

  if (
    typeof submission.code !== "string" ||
    typeof submission.language !== "string" ||
    !isLang(submission.language)
  ) {
    return {
      ok: false,
      message: "The stored submission contains invalid data.",
    };
  }

  return {
    ok: true,
    code: submission.code,
    language: submission.language,
  };
}