// Creates reusable maps and sets so the calculation files do not repeatedly process the same data

import {
  isDifficulty,
  type Difficulty,
} from "@/lib/difficulty";

import type {
  AnalyticsSourceData,
  ProblemRow,
  SubmissionRow,
} from "./types";

export interface ProblemContext {
  problemById: Map<number, ProblemRow>;

  difficultyByProblem: Map<
    number,
    Difficulty
  >;

  submissionsByProblem: Map<
    number,
    SubmissionRow[]
  >;

  attemptedProblemIds: Set<number>;
  completedProblemIds: Set<number>;
}

export function buildProblemContext(
  data: AnalyticsSourceData,
): ProblemContext {
  const problemById = new Map<
    number,
    ProblemRow
  >();

  const difficultyByProblem = new Map<
    number,
    Difficulty
  >();

  for (const problem of data.problems) {
    problemById.set(problem.id, problem);

    if (isDifficulty(problem.difficulty)) {
      difficultyByProblem.set(
        problem.id,
        problem.difficulty,
      );
    }
  }

  const submissionsByProblem = new Map<
    number,
    SubmissionRow[]
  >();

  const attemptedProblemIds =
    new Set<number>();

  for (const submission of data.submissions) {
    attemptedProblemIds.add(
      submission.problemId,
    );

    const current =
      submissionsByProblem.get(
        submission.problemId,
      );

    if (current) {
      current.push(submission);
    } else {
      submissionsByProblem.set(
        submission.problemId,
        [submission],
      );
    }
  }

  // Makes first-submission calculations reliable
  // even if the database query order changes.
  for (const submissions of submissionsByProblem.values()) {
    submissions.sort(
      (first, second) =>
        first.createdAt.localeCompare(
          second.createdAt,
        ) || first.id - second.id,
    );
  }

  const completedProblemIds =
    new Set<number>();

  for (const status of data.statuses) {
    if (status.completed) {
      completedProblemIds.add(
        status.problemId,
      );
    }
  }

  // Fallback in case an accepted submission exists
  // but its status row is missing.
  for (const submission of data.submissions) {
    if (submission.passed) {
      completedProblemIds.add(
        submission.problemId,
      );
    }
  }

  return {
    problemById,
    difficultyByProblem,
    submissionsByProblem,
    attemptedProblemIds,
    completedProblemIds,
  };
}