import React from "react";
import ProblemsList from "../components/ProblemsList";
import problemsData from "../data/neetcode_150_problems.json"; 

const ProblemsPage = () => {
  const problems = problemsData.problems;
  return <div className = "pt-4 px-10 xs:px-6 sm:px-14 lg:px-50">
    <ProblemsList problems={ problems } />
  </div>;
};

export default ProblemsPage;
