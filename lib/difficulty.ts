type Difficulty = "Easy" | "Medium" | "Hard";

const difficultyColor: Record<Difficulty, string> = {
  Easy:   "text-green-700 dark:text-green-500",
  Medium: "text-orange-600 dark:text-orange-300",
  Hard:   "text-[#A80006] dark:text-red-500",
};

/**
 * Returns the Tailwind class for a difficulty string.
 * If the string isn’t one of "Easy" | "Medium" | "Hard", returns "".
 */
export function getDifficulty(level: string): string {
  if (level === "Easy" || level === "Medium" || level === "Hard") {
    return difficultyColor[level];
  }
  return "";
}