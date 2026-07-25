import type { Difficulty } from "@/lib/difficulty";

import type {
  DashboardAnalytics,
  SubmissionFrequencyPoint,
} from "../types";

import type { SubmissionRow } from "./types";

import {
  addUtcDays,
  getLastTwelveMonthsStart,
  MILLISECONDS_PER_WEEK,
  startOfUtcDay,
} from "./utils";

type DifficultyChartKey =
  | "easy"
  | "medium"
  | "hard";

const weekLabelFormatter =
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

const monthLabelFormatter =
  new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });

function createEmptyPoint(
  label: string,
): SubmissionFrequencyPoint {
  return {
    label,
    easy: 0,
    medium: 0,
    hard: 0,
  };
}

function getDifficultyKey(
  difficulty: Difficulty,
): DifficultyChartKey {
  return difficulty.toLowerCase() as DifficultyChartKey;
}

function buildFourWeekData(
  submissions: SubmissionRow[],
  difficultyByProblem: Map<number, Difficulty>,
  now: Date,
): SubmissionFrequencyPoint[] {
  const firstDay = addUtcDays(
    startOfUtcDay(now),
    -27,
  );

  const buckets = Array.from(
    { length: 4 },
    (_, index) => {
      const start = addUtcDays(
        firstDay,
        index * 7,
      );

      const end = addUtcDays(start, 6);

      const label =
        `${weekLabelFormatter.format(start)}–` +
        weekLabelFormatter.format(end);

      return createEmptyPoint(label);
    },
  );

  for (const submission of submissions) {
    const submittedAt = new Date(
      submission.createdAt,
    );

    const submittedAtTime =
      submittedAt.getTime();

    if (
      !Number.isFinite(submittedAtTime) ||
      submittedAtTime < firstDay.getTime() ||
      submittedAtTime > now.getTime()
    ) {
      continue;
    }

    const bucketIndex = Math.floor(
      (submittedAtTime -
        firstDay.getTime()) /
        MILLISECONDS_PER_WEEK,
    );

    if (
      bucketIndex < 0 ||
      bucketIndex >= buckets.length
    ) {
      continue;
    }

    const difficulty =
      difficultyByProblem.get(
        submission.problemId,
      );

    if (!difficulty) {
      continue;
    }

    const difficultyKey =
      getDifficultyKey(difficulty);

    buckets[bucketIndex][difficultyKey] += 1;
  }

  return buckets;
}

function buildTwelveMonthData(
  submissions: SubmissionRow[],
  difficultyByProblem: Map<number, Difficulty>,
  now: Date,
): SubmissionFrequencyPoint[] {
  const firstMonth =
    getLastTwelveMonthsStart(now);

  const firstYear =
    firstMonth.getUTCFullYear();

  const firstMonthIndex =
    firstMonth.getUTCMonth();

  const buckets = Array.from(
    { length: 12 },
    (_, index) => {
      const bucketDate = new Date(
        Date.UTC(
          firstYear,
          firstMonthIndex + index,
          1,
        ),
      );

      return createEmptyPoint(
        monthLabelFormatter.format(bucketDate),
      );
    },
  );

  for (const submission of submissions) {
    const submittedAt = new Date(
      submission.createdAt,
    );

    const submittedAtTime =
      submittedAt.getTime();

    if (
      !Number.isFinite(submittedAtTime) ||
      submittedAtTime <
        firstMonth.getTime() ||
      submittedAtTime > now.getTime()
    ) {
      continue;
    }

    const bucketIndex =
      (submittedAt.getUTCFullYear() -
        firstYear) *
        12 +
      submittedAt.getUTCMonth() -
      firstMonthIndex;

    if (
      bucketIndex < 0 ||
      bucketIndex >= buckets.length
    ) {
      continue;
    }

    const difficulty =
      difficultyByProblem.get(
        submission.problemId,
      );

    if (!difficulty) {
      continue;
    }

    const difficultyKey =
      getDifficultyKey(difficulty);

    buckets[bucketIndex][difficultyKey] += 1;
  }

  return buckets;
}

export function calculateFrequencyMetrics(
  submissions: SubmissionRow[],
  difficultyByProblem: Map<number, Difficulty>,
  now: Date,
): Pick<
  DashboardAnalytics,
  "fourWeekData" | "twelveMonthData"
> {
  return {
    fourWeekData: buildFourWeekData(
      submissions,
      difficultyByProblem,
      now,
    ),

    twelveMonthData: buildTwelveMonthData(
      submissions,
      difficultyByProblem,
      now,
    ),
  };
}