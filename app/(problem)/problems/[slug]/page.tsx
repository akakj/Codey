import React from 'react';
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProblemWorkspace from "@/app/components/ProblemWorkspace/ProblemWorkspace";
import rawData from "@/app/data/neetcode_150_problems.json";
import { ProblemsFile } from "@/lib/problem";

type Props = {
  params: { slug: string };
  searchParams: { tab?: string | string[] };
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  const data = rawData as ProblemsFile;
  const problem = data.problems.find((p) => p.slug === slug);

  return {
    title: problem?.title ?? "Problem",
  };
}

export default async function ProblemPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams:  Promise<{ tab?: string | string[] }>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);

  const tabParam = Array.isArray(sp.tab) ? sp.tab[0] : sp.tab;
  const initialTab = tabParam ?? "description";

  const data = rawData as ProblemsFile;
  const problem = data.problems.find((p) => p.slug === slug);
  if (!problem) return notFound();


  return (
    <ProblemWorkspace
      initialTab={initialTab}
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
