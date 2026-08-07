import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type ProblemCompletionCheckProps = {
  completed: boolean;
  className?: string;
};

export function ProblemCompletionCheck({
  completed,
  className,
}: ProblemCompletionCheckProps) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
      {completed && (
        <>
          <Check
            aria-hidden="true"
            className={cn(
              "h-5 w-5 stroke-2 text-green-700 dark:text-green-400",
              className,
            )}
          />

          <span className="sr-only">
            Completed
          </span>
        </>
      )}
    </span>
  );
}