import type { Metadata } from "next";

import ProblemsList from "@/app/components/ProblemsList";
import rawData from "@/app/data/neetcode_150_problems_with_entry.json";
import type { ProblemLite, ProblemsFile } from "@/lib/problem";

import { getUserProblemProgress } from "@/lib/getUserProblemProgress";

export const metadata: Metadata = {
  title: "Problems",
};

export const dynamic = "force-dynamic";

type ProblemsPageProps = {
  searchParams: Promise<{
    topic?: string | string[];
  }>;
};

export default async function ProblemsPage({
  searchParams,
}: ProblemsPageProps) {
  const data = rawData as ProblemsFile;

  const params = await searchParams;

  const topic =
    typeof params.topic === "string"
      ? params.topic
      : "";

  const { completedProblemIds } = await getUserProblemProgress();

  const problems: ProblemLite[] = data.problems.map(
    ({ problemID, slug, title, difficulty, algorithm }) => ({
      problemID,
      slug,
      title,
      difficulty,
      algorithm,
    }),
  );

  return (
    <div className="px-10 pt-4 xs:px-6 sm:px-14 lg:px-50">
      <ProblemsList
        problems={problems}
        completedProblemIds={completedProblemIds}
        initialTopic={topic}
      />
    </div>
  );
}