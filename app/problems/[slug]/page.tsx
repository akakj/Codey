import React from 'react';
import { notFound } from "next/navigation";
import ProblemWorkspace from "@/app/components/ProblemWorkspace/ProblemWorkspace";
import rawData from "@/app/data/neetcode_150_problems.json";
import { ProblemsFile } from "@/lib/problem";

export default function ProblemPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { tab?: string };
}) {
  const data = rawData as ProblemsFile;
  const problem = data.problems.find(p => p.slug === params.slug);
  if (!problem) return notFound();

  return (
    <ProblemWorkspace
      initialTab={searchParams?.tab ?? "description"}
      problem={{
        problemID: problem.problemID,
        slug: problem.slug,
        title: problem.title,
        difficulty: problem.difficulty,
        description: problem.description,
        sampleTestCase: problem.sampleTestCase,
        examples: problem.examples,
        hints: problem.hints,
        testCases: problem.testCases,
        algorithm: problem.algorithm,
        starterCode: problem.starterCode,
      }}
    />
  );
}
