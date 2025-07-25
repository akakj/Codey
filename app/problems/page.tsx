import React from "react";
import ProblemsList from "../components/ProblemsList";
import problemsData from "../data/neetcode_150_problems.json"; 

const ProblemsPage = () => {
  const problems = problemsData.problems;
  return <div className = "p-4">
    <ProblemsList problems={ problems } />
  </div>;
};

export default ProblemsPage;
