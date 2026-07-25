// Calculates problem-level metrics

import type {
  DashboardAnalytics,
} from "../types";

import type {
  ProblemContext,
} from "./problemContext";

import {
  percentage,
  roundToOneDecimal,
} from "./utils";

type ProblemMetrics = Pick<
  DashboardAnalytics,
  | "solvedProblems"
  | "problemsAttempted"
  | "completionRate"
  | "problemsStartedNotSolved"
  | "averageAttemptsPerSolvedProblem"
  | "firstAttemptSuccessRate"
  | "solvedByDifficulty"
  | "mostAttemptedUnsolved"
  | "recentlySolved"
>;

export function calculateProblemMetrics(
  context: ProblemContext,
): ProblemMetrics {
  const problemsAttempted =
    context.attemptedProblemIds.size;

  const solvedProblems =
    context.completedProblemIds.size;

  const completionRate = percentage(
    solvedProblems,
    problemsAttempted,
  );

  const problemsStartedNotSolved = [
    ...context.attemptedProblemIds,
  ].filter(
    (problemId) =>
      !context.completedProblemIds.has(
        problemId,
      ),
  ).length;

  const solvedByDifficulty = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  };

  for (
    const problemId of
    context.completedProblemIds
  ) {
    const difficulty =
      context.difficultyByProblem.get(
        problemId,
      );

    if (difficulty) {
      solvedByDifficulty[difficulty] += 1;
    }
  }

  const attemptsToFirstSuccess: number[] = [];
  let firstAttemptSuccesses = 0;

  let latestFirstAccepted:
    | {
        problemId: number;
        solvedAt: string;
      }
    | null = null;

  for (const [
    problemId,
    submissions,
  ] of context.submissionsByProblem) {
    const firstSubmission = submissions[0];

    if (firstSubmission?.passed) {
      firstAttemptSuccesses += 1;
    }

    const firstAcceptedIndex =
      submissions.findIndex(
        (submission) => submission.passed,
      );

    if (firstAcceptedIndex < 0) {
      continue;
    }

    const firstAccepted =
      submissions[firstAcceptedIndex];

    attemptsToFirstSuccess.push(
      firstAcceptedIndex + 1,
    );

    if (
      !latestFirstAccepted ||
      firstAccepted.createdAt >
        latestFirstAccepted.solvedAt
    ) {
      latestFirstAccepted = {
        problemId,
        solvedAt:
          firstAccepted.createdAt,
      };
    }
  }

  const averageAttemptsPerSolvedProblem =
    attemptsToFirstSuccess.length === 0
      ? null
      : roundToOneDecimal(
          attemptsToFirstSuccess.reduce(
            (total, attempts) =>
              total + attempts,
            0,
          ) /
            attemptsToFirstSuccess.length,
        );

  // The denominator is every attempted problem,
  // not only successfully solved problems.
  const firstAttemptSuccessRate = percentage(
    firstAttemptSuccesses,
    context.submissionsByProblem.size,
  );

  let mostAttemptedUnsolved:
    DashboardAnalytics["mostAttemptedUnsolved"] =
    null;

  for (const [
    problemId,
    submissions,
  ] of context.submissionsByProblem) {
    if (
      context.completedProblemIds.has(
        problemId,
      )
    ) {
      continue;
    }

    const problem =
      context.problemById.get(problemId);

    if (!problem) {
      continue;
    }

    const attempts = submissions.length;

    if (
      !mostAttemptedUnsolved ||
      attempts >
        mostAttemptedUnsolved.attempts ||
      (attempts ===
        mostAttemptedUnsolved.attempts &&
        problem.title.localeCompare(
          mostAttemptedUnsolved.title,
        ) < 0)
    ) {
      mostAttemptedUnsolved = {
        title: problem.title,
        slug: problem.slug,
        attempts,
      };
    }
  }

  const recentlySolved = (() => {
    if (!latestFirstAccepted) {
      return null;
    }

    const problem =
      context.problemById.get(
        latestFirstAccepted.problemId,
      );

    if (!problem) {
      return null;
    }

    return {
      title: problem.title,
      slug: problem.slug,
      solvedAt:
        latestFirstAccepted.solvedAt,
    };
  })();

  return {
    solvedProblems,
    problemsAttempted,
    completionRate,
    problemsStartedNotSolved,
    averageAttemptsPerSolvedProblem,
    firstAttemptSuccessRate,
    solvedByDifficulty,
    mostAttemptedUnsolved,
    recentlySolved,
  };
}