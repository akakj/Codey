import React from "react";
import ProblemsList from "@/app/components/ProblemsList";
import rawData from "@/app/data/neetcode_150_problems.json";
import { ProblemsFile } from "@/lib/problem";

const ProblemsPage = () => {
  const { problems } = rawData as ProblemsFile;
  return <div className = "pt-4 px-10 xs:px-6 sm:px-14 lg:px-50">
    <ProblemsList problems = { problems } />
  </div>;
};

export default ProblemsPage;
