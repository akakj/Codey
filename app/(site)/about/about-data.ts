import {
  BarChart3,
  Braces,
  Code2,
  History,
  ShieldCheck,
  Timer,
} from "lucide-react";

export const features = [
  {
    title: "150 coding problems",
    description:
      "Practise algorithms and data structures across Easy, Medium and Hard difficulty levels.",
    icon: Braces,
  },
  {
    title: "Multi-language execution",
    description:
      "Write and execute solutions in JavaScript, Python, Java and C# using a browser-based Monaco editor.",
    icon: Code2,
  },
  {
    title: "Run and Submit",
    description:
      "Test solutions against visible or custom cases, then submit them for evaluation against the complete test suite.",
    icon: ShieldCheck,
  },
  {
    title: "Submission history",
    description:
      "Review previous attempts, accepted solutions, failed cases, runtime, memory usage and submitted code.",
    icon: History,
  },
  {
    title: "Progress analytics",
    description:
      "Track solved problems, acceptance rates, language usage, submission trends and problem-solving performance.",
    icon: BarChart3,
  },
  {
    title: "Active-time insights",
    description:
      "Measure active problem-solving time, average submission time and time taken to reach an accepted solution.",
    icon: Timer,
  },
];

export const technologies = [
  {
    name: "Next.js",
    className:
      "border-neutral-300 bg-neutral-950/5 text-neutral-900 dark:border-neutral-700 dark:bg-white/10 dark:text-white",
    dotClassName: "bg-neutral-950 dark:bg-white",
  },
  {
    name: "React",
    className:
      "border-[#087EA4]/30 bg-[#61DAFB]/10 text-[#087EA4] dark:border-[#61DAFB]/35 dark:bg-[#61DAFB]/10 dark:text-[#61DAFB]",
    dotClassName: "bg-[#149ECA] dark:bg-[#61DAFB]",
  },
  {
    name: "TypeScript",
    className:
      "border-[#3178C6]/30 bg-[#3178C6]/10 text-[#235A97] dark:border-[#5B9BD5]/35 dark:bg-[#3178C6]/15 dark:text-[#75B7F0]",
    dotClassName: "bg-[#3178C6] dark:bg-[#75B7F0]",
  },
  {
    name: "Tailwind CSS",
    className:
      "border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#0E7490] dark:border-[#22D3EE]/35 dark:bg-[#06B6D4]/15 dark:text-[#67E8F9]",
    dotClassName: "bg-[#06B6D4] dark:bg-[#67E8F9]",
  },
  {
    name: "shadcn/ui",
    className:
      "border-neutral-300 bg-neutral-950/5 text-neutral-900 dark:border-neutral-700 dark:bg-white/10 dark:text-white",
    dotClassName: "bg-neutral-950 dark:bg-white",
  },
  {
    name: "Monaco Editor",
    className:
      "border-[#007ACC]/30 bg-[#007ACC]/10 text-[#0065A9] dark:border-[#4DB3FF]/35 dark:bg-[#007ACC]/15 dark:text-[#75C7FF]",
    dotClassName: "bg-[#007ACC] dark:bg-[#75C7FF]",
  },
  {
    name: "Supabase",
    className:
      "border-[#3ECF8E]/30 bg-[#3ECF8E]/10 text-[#157A55] dark:border-[#3ECF8E]/35 dark:bg-[#3ECF8E]/15 dark:text-[#6EE7B7]",
    dotClassName: "bg-[#3ECF8E] dark:bg-[#6EE7B7]",
  },
  {
    name: "PostgreSQL",
    className:
      "border-[#336791]/30 bg-[#336791]/10 text-[#285175] dark:border-[#7BA7D1]/35 dark:bg-[#336791]/15 dark:text-[#9CC3E7]",
    dotClassName: "bg-[#336791] dark:bg-[#9CC3E7]",
  },
  {
    name: "JDoodle API",
    className:
      "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:border-orange-400/35 dark:bg-orange-400/10 dark:text-orange-300",
    dotClassName: "bg-orange-500 dark:bg-orange-300",
  },
  {
    name: "Recharts",
    className:
      "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:border-violet-400/35 dark:bg-violet-400/10 dark:text-violet-300",
    dotClassName: "bg-violet-500 dark:bg-violet-300",
  },
] as const;

export const questions = [
  {
    question: "What is the difference between Run and Submit?",
    answer:
      "Run executes your code against the visible or custom test cases without saving a submission. Submit evaluates the solution against the complete test suite, stores the result and updates your progress.",
  },
  {
    question: "Which programming languages are supported?",
    answer:
      "Codey currently supports JavaScript, Python 3, Java and C#. Each language uses its own execution wrapper while returning results in a shared format.",
  },
  {
    question: "Are submissions saved?",
    answer:
      "Authenticated users can review their previous submissions, including the submitted code, result, language, runtime, memory usage and test-case counts.",
  },
  {
    question: "How is progress measured?",
    answer:
      "Codey records completed problems and submission activity. The analytics dashboard calculates metrics such as acceptance rate, completion rate, attempts per problem, language performance and active practice time.",
  },
  {
    question: "Is Codey a production code-execution service?",
    answer:
      "No. Codey is a personal learning project created to explore the engineering behind coding platforms. Code execution relies on the JDoodle API, so external request, usage and output limits apply.",
  },
  {
    question:
      "I get an error message saying 'JDoodle API rate limit exceeded'. What should I do?",
    answer:
      "Due to the current JDoodle API tier used by Codey, code executions are limited to 22 per day. If this limit has been reached, please try again the following day. I apologise for any inconvenience caused.",
  },
  {
    question:
      "When trying to log in, I get an 'Email rate limit exceeded' error. What should I do?",
    answer:
      "This means that too many authentication emails have been requested within a short period of time. Please wait a while before trying again. If the issue persists, please contact me through the Contact page.",
  },
];
