import React from 'react';
import { notFound } from "next/navigation";
import ProblemWorkspace from "@/app/components/ProblemWorkspace/ProblemWorkspace";
import problemsData from "@/app/data/neetcode_150_problems.json";
import { StarterMap } from "@/lib/languages"

export default function ProblemPage({ params }: { params: { slug: string } }) {
  const problem = problemsData.problems.find((p: any) => p.slug === params.slug);
  if (!problem) return notFound();
  
   const starterCodeByLang: StarterMap = problem.starterCode ?? {};

  return (
    <ProblemWorkspace
      problem={{
        id: problem.problemID,
        slug: problem.slug,
        title: problem.title,
        difficulty: problem.difficulty,
        description: problem.description, 
        sampleTestCase: problem.sampleTestCase,
        examples: problem.examples,
        hints: problem.hints,
        testCases: problem.testCases,
        algorithm: problem.algorithm,
        starterCodeByLang,
      }}
    />
  );
}
