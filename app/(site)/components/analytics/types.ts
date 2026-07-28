import type { Difficulty } from "@/lib/difficulty";

export interface SubmissionFrequencyPoint {
  label: string;
  easy: number;
  medium: number;
  hard: number;
}

export interface DifficultyAcceptancePoint {
  difficulty: Difficulty;
  submissions: number;
  passed: number;
  acceptanceRate: number | null;
}

export interface LanguageAnalyticsPoint {
  language: string;
  submissions: number;
  passed: number;
  share: number;
  acceptanceRate: number | null;
}

export interface DashboardAnalytics extends TimeAnalytics {
  solvedProblems: number;
  problemsAttempted: number;
  acceptanceRate: number | null;
  completionRate: number | null;
  currentActivityStreak: number;
  averageAttemptsPerSolvedProblem: number | null;
  firstAttemptSuccessRate: number | null;
  testCasePassRate: number | null;
  nearlySuccessfulSubmissions: number;
  activeDaysLast30: number;
  problemsStartedNotSolved: number;
  mostPractisedDifficulty: string | null;
  mostUsedLanguage: string | null;

  solvedByDifficulty: Record<Difficulty, number>;

  difficultyAcceptance: DifficultyAcceptancePoint[];
  languageAnalytics: LanguageAnalyticsPoint[];

  recentSuccessTrend: {
    currentRate: number | null;
    previousRate: number | null;
    change: number | null;
  };

  mostAttemptedUnsolved: {
    title: string;
    slug: string;
    attempts: number;
  } | null;

  recentlySolved: {
    title: string;
    slug: string;
    solvedAt: string;
  } | null;

  fourWeekData: SubmissionFrequencyPoint[];
  twelveMonthData: SubmissionFrequencyPoint[];
}

export interface TimeAnalytics {
  /**
   * All values in this interface are measured in minutes.
   */
  totalActiveTime: number;
  averageTimePerSubmission: number | null;
  medianTimePerSubmission: number | null;
  averageTimeToFirstAccepted: number | null;
}