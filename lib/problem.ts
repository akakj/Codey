import type { StarterMap } from "@/lib/languages";
import type { Lang } from "@/lib/languages";

export interface TestCase {
  input: any;
  expectedOutput: any;
}

export type EntryPoint =
  | { kind: "function"; name: string }
  | { kind: "method"; className: string; name: string };

export type EntryPointByLang = Partial<Record<Lang, EntryPoint>>;

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
  entryPoint?: EntryPointByLang;
}

export type ProblemLite = {
  problemID: number;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
};

export interface ProblemsFile {
  problems: Problem[];
}
