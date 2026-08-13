import {
  Braces,
  ChartNoAxesCombined,
  TestTube2,
} from "lucide-react";

export const features = [
  {
    title: "Solve coding problems",
    description:
      "Practise algorithms and data structures across a range of topics and difficulty levels.",
    icon: Braces,
    accent: "border-t-blue-500",
    iconStyle:
      "border-blue-500/30 bg-blue-500/10 text-blue-500 dark:text-blue-400",
  },
  {
    title: "Run and test your code",
    description:
      "Write code in the browser and test your solution using provided or custom test cases.",
    icon: TestTube2,
    accent: "border-t-orange-500",
    iconStyle:
      "border-orange-500/30 bg-orange-500/10 text-orange-500 dark:text-orange-400",
  },
  {
    title: "Track your progress",
    description:
      "Submit solutions, review previous attempts, and follow your progress over time.",
    icon: ChartNoAxesCombined,
    accent: "border-t-purple-500",
    iconStyle:
      "border-purple-500/30 bg-purple-500/10 text-purple-500 dark:text-purple-400",
  },
];

export const stats = [
  {
    value: "150+",
    label: "Coding problems",
  },
  {
    value: "4",
    label: "Supported languages",
  },
  {
    value: "Instant",
    label: "Test feedback",
  },
];

export const codeExamples = {
  python: {
    label: "Python",
    monacoLanguage: "python",
    code: `def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i`,
  },
  javascript: {
    label: "JavaScript",
    monacoLanguage: "javascript",
    code: `function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }

    seen.set(nums[i], i);
  }
}`,
  },
  java: {
    label: "Java",
    monacoLanguage: "java",
    code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();

    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];

        if (seen.containsKey(complement)) {
            return new int[] { seen.get(complement), i };
        }

        seen.put(nums[i], i);
    }

    return new int[0];
}`,
  },
  csharp: {
    label: "C#",
    monacoLanguage: "csharp",
    code: `public int[] TwoSum(int[] nums, int target)
{
    var seen = new Dictionary<int, int>();

    for (int i = 0; i < nums.Length; i++)
    {
        int complement = target - nums[i];

        if (seen.TryGetValue(complement, out int index))
            return new[] { index, i };

        seen[nums[i]] = i;
    }

    return Array.Empty<int>();
}`,
  },
} as const;

export type LanguageKey = keyof typeof codeExamples;

export const previewTestCases = [
  {
    label: "Case 1",
    input: `nums = [2, 7, 11, 15]\ntarget = 9`,
    output: "[0, 1]",
  },
  {
    label: "Case 2",
    input: `nums = [3, 2, 4]\ntarget = 6`,
    output: "[1, 2]",
  },
  {
    label: "Custom",
    input: `nums = [3, 3]\ntarget = 6`,
    output: "[0, 1]",
  },
] as const;