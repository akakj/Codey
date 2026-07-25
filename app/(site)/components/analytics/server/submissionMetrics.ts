// Handles submission, difficulty, language and test-case metrics

import {
  DIFFICULTIES,
  type Difficulty,
} from "@/lib/difficulty";

import type {
  DashboardAnalytics,
} from "../types";

import type {
  ProblemContext,
} from "./problemContext";

import type {
  SubmissionRow,
} from "./types";

import {
  percentage,
} from "./utils";

type SubmissionMetrics = Pick<
  DashboardAnalytics,
  | "acceptanceRate"
  | "difficultyAcceptance"
  | "mostPractisedDifficulty"
  | "languageAnalytics"
  | "mostUsedLanguage"
  | "testCasePassRate"
  | "nearlySuccessfulSubmissions"
>;

export function calculateSubmissionMetrics(
  submissions: SubmissionRow[],
  context: ProblemContext,
): SubmissionMetrics {
  const passedSubmissions =
    submissions.filter(
      (submission) => submission.passed,
    ).length;

  const acceptanceRate = percentage(
    passedSubmissions,
    submissions.length,
  );

  const difficultyCounts: Record<
    Difficulty,
    {
      submissions: number;
      passed: number;
    }
  > = {
    Easy: {
      submissions: 0,
      passed: 0,
    },
    Medium: {
      submissions: 0,
      passed: 0,
    },
    Hard: {
      submissions: 0,
      passed: 0,
    },
  };

  for (const submission of submissions) {
    const difficulty =
      context.difficultyByProblem.get(
        submission.problemId,
      );

    if (!difficulty) {
      continue;
    }

    difficultyCounts[
      difficulty
    ].submissions += 1;

    if (submission.passed) {
      difficultyCounts[difficulty].passed += 1;
    }
  }

  const difficultyAcceptance =
    DIFFICULTIES.map((difficulty) => {
      const counts =
        difficultyCounts[difficulty];

      return {
        difficulty,
        submissions: counts.submissions,
        passed: counts.passed,
        acceptanceRate: percentage(
          counts.passed,
          counts.submissions,
        ),
      };
    });

  const highestDifficultySubmissionCount =
    Math.max(
      0,
      ...difficultyAcceptance.map(
        (item) => item.submissions,
      ),
    );

  const mostPractisedDifficulty =
    highestDifficultySubmissionCount === 0
      ? null
      : difficultyAcceptance
          .filter(
            (item) =>
              item.submissions ===
              highestDifficultySubmissionCount,
          )
          .map((item) => item.difficulty)
          .join(" & ");

  const languageCounts = new Map<
    string,
    {
      submissions: number;
      passed: number;
    }
  >();

  for (const submission of submissions) {
    const language =
      submission.language.trim() ||
      "unknown";

    const current =
      languageCounts.get(language) ?? {
        submissions: 0,
        passed: 0,
      };

    current.submissions += 1;

    if (submission.passed) {
      current.passed += 1;
    }

    languageCounts.set(
      language,
      current,
    );
  }

  const languageAnalytics = [
    ...languageCounts.entries(),
  ]
    .map(([language, counts]) => ({
      language,
      submissions: counts.submissions,
      passed: counts.passed,

      share:
        percentage(
          counts.submissions,
          submissions.length,
        ) ?? 0,

      acceptanceRate: percentage(
        counts.passed,
        counts.submissions,
      ),
    }))
    .sort(
      (first, second) =>
        second.submissions -
          first.submissions ||
        first.language.localeCompare(
          second.language,
        ),
    );

  const mostUsedLanguage =
    languageAnalytics[0]?.language ?? null;

  let passedTestCases = 0;
  let totalTestCases = 0;
  let nearlySuccessfulSubmissions = 0;

  for (const submission of submissions) {
    const totalCases = Math.max(
      0,
      Number(submission.totalCases) || 0,
    );

    const passedCases = Math.min(
      totalCases,
      Math.max(
        0,
        Number(submission.passedCases) || 0,
      ),
    );

    if (totalCases > 0) {
      totalTestCases += totalCases;
      passedTestCases += passedCases;
    }

    if (
      !submission.passed &&
      totalCases > 0 &&
      passedCases / totalCases >= 0.8
    ) {
      nearlySuccessfulSubmissions += 1;
    }
  }

  return {
    acceptanceRate,
    difficultyAcceptance,
    mostPractisedDifficulty,
    languageAnalytics,
    mostUsedLanguage,

    testCasePassRate: percentage(
      passedTestCases,
      totalTestCases,
    ),

    nearlySuccessfulSubmissions,
  };
}