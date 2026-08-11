import type { Metadata } from "next";

import ProblemsList from "@/app/components/ProblemsList";
import rawData from "@/app/data/neetcode_150_problems_with_entry.json";
import type { ProblemLite, ProblemsFile } from "@/lib/problem";

import { getUserProblemProgress } from "@/lib/getUserProblemProgress";

export const metadata: Metadata = {
  title: "Problems",
};

// Prevent caching of this page so that the completed problems list is always up to date
export const dynamic = "force-dynamic";

export default async function ProblemsPage() {
  const data = rawData as ProblemsFile;

  const { completedProblemIds } = await getUserProblemProgress();

  const problems: ProblemLite[] = data.problems.map(
    ({ problemID, slug, title, difficulty }) => ({
      problemID,
      slug,
      title,
      difficulty,
    }),
  );

  return (
    <div className="px-10 pt-4 xs:px-6 sm:px-14 lg:px-50">
      <ProblemsList
        problems={problems}
        completedProblemIds={completedProblemIds}
      />
    </div>
  );
}
