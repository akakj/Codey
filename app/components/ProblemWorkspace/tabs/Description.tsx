import type { Problem } from "@/lib/problem";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getDifficulty } from "@/lib/difficulty";
import HintsAlgorithms from "./HintsAlgorithms";

export default function Description({ problem }: { problem: Problem }) {
  const html = (problem.description ?? "").trim();
  const difficultyClass = getDifficulty(problem.difficulty);

  // crude checks to avoid duplicating sections if HTML already has them
  const hasExamplesInHtml =
    // matches: class="example" (or any class list containing "example")
    /class=["'][^"']*\bexample\b[^"']*["']/i.test(html) ||
    // matches: <strong>Example 1:</strong>
    /<strong[^>]*>\s*Example\s*\d+/i.test(html) ||
    // matches: "Example 1:" even without <strong>
    /\bExample\s*\d+\s*:/i.test(html);
  const hasHintsInHtml =
    /class=["']?hint/i.test(html) || /<strong[^>]*>Hint/i.test(html);

  const algorithms = problem.algorithm
    ? problem.algorithm
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <article
      className={cn(
        "prose dark:prose-invert max-w-none m-2",
        "[&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-x-auto",
        "[&_code]:break-words"
      )}
    >
      <h1 className="mt-0 text-2xl font-bold">{problem.title}</h1>

      <div className="mt-2 mb-3 flex items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            "rounded-full px-2.5 py-0.5 font-semibold tracking-wide ring-1 ring-gray-400 dark:ring-gray-900 bg-gray-50 dark:bg-gray-800",
            difficultyClass
          )}
        >
          {problem.difficulty}
        </Badge>
      </div>

      <div dangerouslySetInnerHTML={{ __html: html }} />

      {/* Fallbacks only if the HTML doesn't already include them */}
      {!hasExamplesInHtml && problem.examples?.length ? (
        <section className="mt-6">
          <h3>Examples</h3>
          <ul className="list-disc pl-6">
            {problem.examples.map((ex, i) => (
              <li key={i}>
                <pre className="overflow-x-auto">{ex}</pre>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <HintsAlgorithms
        algorithms={algorithms}
        hints={hasHintsInHtml ? [] : problem.hints ?? []}
      />
    </article>
  );
}
