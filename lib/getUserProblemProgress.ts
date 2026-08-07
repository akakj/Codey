import "server-only";

import type { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/server";

type UserProblemProgress = {
  user: User | null;
  completedProblemIds: number[];
};

export async function getUserProblemProgress(): Promise<UserProblemProgress> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authenticationError,
  } = await supabase.auth.getUser();

  if (authenticationError) {
    console.error(
      "Could not retrieve authenticated user:",
      authenticationError,
    );

    return {
      user: null,
      completedProblemIds: [],
    };
  }

  if (!user) {
    return {
      user: null,
      completedProblemIds: [],
    };
  }

  const {
    data: completedRows,
    error: completedProblemsError,
  } = await supabase
    .from("user_problem_status")
    .select("problemId")
    .eq("userId", user.id)
    .eq("completed", true);

  if (completedProblemsError) {
    console.error(
      "Could not load completed problems:",
      completedProblemsError,
    );

    return {
      user,
      completedProblemIds: [],
    };
  }

  return {
    user,
    completedProblemIds: (completedRows ?? []).map(
      (row) => row.problemId,
    ),
  };
}