import type { Lang, StarterMap } from "@/lib/languages";
import raw from "@/app/data/solutions.json";

export type SolutionEntry = {
  slug: string;
  updatedAt: string;
  runner?: { lang: Lang; code: string };
  approachMd?: string;
  complexity?: { time?: string; space?: string };
  codeByLang?: StarterMap;
};

export type SolutionsJson = {
  updatedAt?: string; // file-level updatedAt
} & Record<string, SolutionEntry>;

const SOLUTIONS = raw as unknown as SolutionsJson;

export function getSolutionBySlug(slug: string): SolutionEntry | null {
  const entry = (SOLUTIONS as Record<string, any>)[slug] as SolutionEntry | undefined;
  return entry?.slug ? entry : null;
}