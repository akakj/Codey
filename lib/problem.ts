import type { StarterMap } from "@/lib/languages";

export interface TestCase {
  input: any;
  expectedOutput: any;
}

export interface Problem {
  problemID: number;
  slug: string;
  title: string;
  difficulty: string;
  description: string;
  sampleTestCase: string;
  examples: string[];
  hints: string[];
  testCases: TestCase[];
  starterCode: StarterMap;
  algorithm?: string;
}

export interface ProblemsFile {
  problems: Problem[];
}
