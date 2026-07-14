import type { StarterMap } from "@/lib/languages";
import type { Lang } from "@/lib/languages";
export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface TestCase {
  input: JsonValue;
  expectedOutput: JsonValue;
}

export type EditableTestCase = {
  input: JsonValue;
  expectedOutput?: JsonValue;
  isUser?: boolean;
};

export type JDoodleResponse = {
  output?: string;
  error?: string;
  memory?: string | number;
  cpuTime?: string | number;
  statusCode?: number;
  compilationStatus?: string | number;
};

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
