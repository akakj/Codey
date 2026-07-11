export type SubmissionFailedCase = {
  caseNum: number;
  input: unknown;
  output?: string | null;
  expectedOutput?: string | null;
  error?: string | null;
  logs?: string | null;
};

export type SubmissionListRow = {
  id: number;
  language: string;
  passed: boolean;
  memory: number | null;
  runtime: number | null;
  createdAt: string;
  passedCases: number | null;
  totalCases: number | null;
};

export type SubmissionDetailRow = SubmissionListRow & {
  code: string;
  failedCase: SubmissionFailedCase | null;
};

export function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function formatDateShort(value: string) {
  return new Date(value).toLocaleDateString();
}

export function formatRuntime(value: number | null) {
  return value == null ? "N/A" : `${value}ms`;
}

export function formatMemory(value: number | null) {
  return value == null ? "N/A" : `${value} KB`;
}

export function statusText(passed: boolean) {
  return passed ? "Accepted" : "Wrong Answer";
}

export function statusClass(passed: boolean) {
  return passed
    ? "text-green-800 dark:text-green-400"
    : "text-red-800 dark:text-red-400";
}

export type SubmissionInputField = {
  name: string;
  value: string;
};

export {
  formatInputFields as inputToFields,
  formatInputValue as stringifyCaseValue,
  stringifyOutputValue as formatSubmissionValue,
} from "@/lib/outputFormatting";
