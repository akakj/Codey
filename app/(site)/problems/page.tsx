import type { Metadata } from "next";

import ProblemsList from "@/app/components/ProblemsList";
import rawData from "@/app/data/neetcode_150_problems_with_entry.json";
import type {
  ProblemLite,
  ProblemsFile,
} from "@/lib/problem";

export const metadata: Metadata = {
  title: "Problems",
};

export default function ProblemsPage() {
  const data = rawData as ProblemsFile;

  const problems: ProblemLite[] = data.problems.map(
    ({
      problemID,
      slug,
      title,
      difficulty,
    }) => ({
      problemID,
      slug,
      title,
      difficulty,
    }),
  );

  return (
    <div className="px-10 pt-4 xs:px-6 sm:px-14 lg:px-50">
      <ProblemsList problems={problems} />
    </div>
  );
}