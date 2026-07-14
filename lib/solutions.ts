import type { Lang, StarterMap } from "@/lib/languages";
import raw from "@/app/data/solutions.json";

export type SolutionEntry = {
  slug: string;
  updatedAt: string;
  runner?: {
    lang: Lang;
    code: string;
  };
  approachMd?: string;
  complexity?: {
    time?: string;
    space?: string;
  };
  codeByLang?: StarterMap;
};

type SolutionsJson = {
  updatedAt?: string;
  [slug: string]: SolutionEntry | string | undefined;
};

const SOLUTIONS = raw as SolutionsJson;

function isSolutionEntry(value: unknown): value is SolutionEntry {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.slug === "string" &&
    typeof entry.updatedAt === "string"
  );
}

export function getSolutionBySlug(
  slug: string,
): SolutionEntry | null {
  const entry = SOLUTIONS[slug];

  return isSolutionEntry(entry) ? entry : null;
}