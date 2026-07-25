// Database row types

export interface SubmissionRow {
  id: number;
  problemId: number;
  language: string;
  passed: boolean;
  passedCases: number | null;
  totalCases: number | null;
  createdAt: string;
}

export interface ProblemStatusRow {
  problemId: number;
  completed: boolean;
}

export interface ProblemRow {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
}

export interface AnalyticsSourceData {
  submissions: SubmissionRow[];
  statuses: ProblemStatusRow[];
  problems: ProblemRow[];
}