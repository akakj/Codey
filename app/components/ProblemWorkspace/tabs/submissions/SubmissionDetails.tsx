import Link from "next/link";
import { MoveLeft } from "lucide-react";
import type { SubmissionDetailRow } from "./submissionUtils";
import {
  formatDate,
  formatMemory,
  formatRuntime,
  formatSubmissionValue,
  inputToFields,
  statusClass,
  statusText,
} from "./submissionUtils";
import SubmissionCodeBlock from "./SubmissionCodeViewer";

function BackLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
    >
      <MoveLeft className="h-4 w-4 mr-2" />
      All submissions
    </Link>
  );
}

function SubmissionStatsCards({
  runtime,
  memory,
}: {
  runtime: number | null;
  memory: number | null;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border bg-muted/30 p-2">
        <p className="text-sm font-semibold text-muted-foreground">Runtime</p>
        <p className="mt-4 font-semibold">{formatRuntime(runtime)}</p>
      </div>

      <div className="rounded-lg border bg-muted/30 p-2">
        <p className="text-sm font-semibold text-muted-foreground">Memory</p>
        <p className="mt-4 font-semibold">{formatMemory(memory)}</p>
      </div>
    </div>
  );
}

function FailedCaseBlock({
  failedCase,
}: {
  failedCase: NonNullable<
    import("./submissionUtils").SubmissionDetailRow["failedCase"]
  >;
}) {
  return (
    <div className="mt-1 rounded-lg border bg-muted/20 p-4">
      <div className="mb-2">
        <h3 className="font-semibold text-red-800 dark:text-red-400">
          Failed Case
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold">Input</p>

          <div className="space-y-3">
            {inputToFields(failedCase.input).map((field) => (
              <div key={field.name}>
                <pre className="overflow-auto rounded-md border bg-background p-3 text-sm whitespace-pre-wrap">
                  {field.name} = {field.value}
                </pre>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Your Output</p>
          <pre className="overflow-auto rounded-md border bg-background p-3 text-sm whitespace-pre-wrap">
            {formatSubmissionValue(failedCase.output)}
          </pre>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Expected Output</p>
          <pre className="overflow-auto rounded-md border bg-background p-3 text-sm whitespace-pre-wrap">
            {formatSubmissionValue(failedCase.expectedOutput)}
          </pre>
        </div>

        {failedCase.error ? (
          <div>
            <p className="mb-2 text-sm font-semibold text-red-500">Error</p>
            <pre className="overflow-auto rounded-md border bg-background p-3 text-sm whitespace-pre-wrap text-red-400">
              {failedCase.error}
            </pre>
          </div>
        ) : null}

        {failedCase.logs ? (
          <div>
            <p className="mb-2 text-sm font-semibold">Logs</p>
            <pre className="overflow-auto rounded-md border bg-background p-3 text-sm whitespace-pre-wrap">
              {failedCase.logs}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function SubmissionDetail({
  item,
  backHref,
}: {
  item: SubmissionDetailRow;
  backHref: string;
}) {
  return (
    <div className="m-2">
      <div>
        <BackLink href={backHref} />
      </div>

      <div className="pb-4">
        <h2 className={`text-xl font-semibold ${statusClass(item.passed)}`}>
          {statusText(item.passed)}
        </h2>

        <div className="mt-2 flex w-full items-center justify-between text-sm">
          {item.passedCases != null && item.totalCases != null ? (
            <span className="text-md">
              {item.passedCases} / {item.totalCases} test cases passed
            </span>
          ) : null}

          <span>Submitted at: {formatDate(item.createdAt)}</span>
        </div>
      </div>

      {item.passed && (
        <SubmissionStatsCards runtime={item.runtime} memory={item.memory} />
      )}

      {!item.passed && item.failedCase ? (
        <FailedCaseBlock failedCase={item.failedCase} />
      ) : null}

      <div>
        <div className="mt-3 mb-2 flex items-center gap-3">
          <h3 className="text-lg font-semibold">Code</h3>
          <span className="text-muted-foreground">|</span>
          <span className="text-lg text-muted-foreground">{item.language}</span>
        </div>

        <SubmissionCodeBlock code={item.code} language={item.language} />
      </div>
    </div>
  );
}
