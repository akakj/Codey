export type Difficulty = "Easy" | "Medium" | "Hard";

export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

const difficultyColor: Record<Difficulty, string> = {
  Easy: "text-green-700 dark:text-green-500",
  Medium: "text-orange-600 dark:text-orange-300",
  Hard: "text-[#A80006] dark:text-red-500",
};

export const difficultyChartColor: Record<Difficulty, string> = {
  Easy: "var(--difficulty-easy)",
  Medium: "var(--difficulty-medium)",
  Hard: "var(--difficulty-hard)",
};

export function isDifficulty(level: string): level is Difficulty {
  return DIFFICULTIES.includes(level as Difficulty);
}

export function getDifficulty(level: string): string {
  return isDifficulty(level) ? difficultyColor[level] : "";
}