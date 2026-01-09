"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, RotateCcw } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type CaseFields = Record<string, string>;
type JsonCase = { input: any; output?: any };

const CASES_NS = (slug: string) => `Codey:cases:${slug}`;

//stringify
const s = (v: any) => {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

// Convert a test case's input to editable fields
function toFields(input: any): CaseFields {
  if (input && typeof input === "object" && !Array.isArray(input)) {
    const out: CaseFields = {};
    for (const [k, v] of Object.entries(input)) out[k] = s(v);
    return out;
  }
  return { input: s(input) };
}

function loadFromStorage(slug: string): CaseFields[] | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CASES_NS(slug));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CaseFields[];
  } catch {
    return null;
  }
}

function deepEqual(a: any, b: any) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function tryParseJson(text: string): any {
  const trimmed = text.trim();
  if (trimmed === "") return "";
  try {
    return JSON.parse(trimmed);
  } catch {
    // keep raw if no t valid JSON
    return text;
  }
}

function fieldsToJsonCase(fields: CaseFields): JsonCase {
  const keys = Object.keys(fields);

  // single input
  if (keys.length === 1 && keys[0] === "input") {
    return { input: tryParseJson(fields["input"]) ?? "" };
  }

  // multiple, named inputs
  const obj: Record<string, any> = {};
  for (const k of keys) obj[k] = tryParseJson(fields[k] ?? "");
  return { input: obj };
}

function allFieldsToJsonCases(all: CaseFields[]): JsonCase[] {
  return all.map(fieldsToJsonCase);
}

export default function ConsoleCases({
  problemSlug,
  initialCases,
  maxCases = 4,
  onCasesChange,
}: {
  problemSlug: string;
  initialCases?: JsonCase[];
  maxCases?: number;
  onCasesChange?: (cases: JsonCase[]) => void;
}) {
  // Build defaults once per problem
  const defaultCases = React.useMemo<CaseFields[]>(() => {
    if (initialCases?.length)
      return initialCases.map((tc) => toFields(tc.input));
    return [{ input: "" }];
  }, [problemSlug, initialCases]);

  // Initial render: use defaults (matches server HTML)
  const [cases, setCases] = React.useState<CaseFields[]>(defaultCases);
  const [active, setActive] = React.useState(0);
  const [hydrated, setHydrated] = React.useState(false);

  // After mount / when slug changes: hydrate from storage
  React.useEffect(() => {
    setHydrated(true); // client only
    const stored = loadFromStorage(problemSlug);
    const nextCases = stored ?? defaultCases;
    setCases(nextCases);
    setActive(0);

    onCasesChange?.(allFieldsToJsonCases(nextCases));
  }, [problemSlug, defaultCases]);

  // Persist only after hydration (prevents clobbering saved cases)
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CASES_NS(problemSlug), JSON.stringify(cases));
    } catch {}

    // notify parent
    onCasesChange?.(allFieldsToJsonCases(cases));
  }, [cases, problemSlug, hydrated, onCasesChange]);

  const reachedLimit = hydrated && cases.length >= maxCases;

  const addCase = () => {
    if (cases.length >= maxCases) return;
    const source =
      cases[active] ?? defaultCases[0] ?? ({ input: "" } as CaseFields);
    const clone: CaseFields = { ...source };
    setCases((prev) => [...prev, clone]);
    setActive(cases.length);
  };

  const removeAt = (index: number) => {
    setCases((prev) => {
      if (prev.length <= 1) return prev; // never remove last
      const next = prev.slice();
      next.splice(index, 1);
      return next;
    });

    setActive((cur) => {
      const nextLen = cases.length - 1;
      if (nextLen <= 0) return 0;
      if (index < cur) return cur - 1;
      if (cur >= nextLen) return nextLen - 1;
      return cur;
    });
  };

  const updateField = (name: string, val: string) => {
    setCases((prev) => {
      const next = prev.slice();
      const current = next[active] ?? ({} as CaseFields);
      next[active] = { ...current, [name]: val };
      return next;
    });
  };

  const atDefault = deepEqual(cases, defaultCases);
  const resetDisabled = !hydrated ? true : atDefault;

  const doReset = () => {
    setCases(defaultCases);
    setActive(0);
    try {
      localStorage.removeItem(CASES_NS(problemSlug));
    } catch {}
  };

  const currentCase = cases[active] ?? defaultCases[0] ?? {};
  const fieldNames = Object.keys(cases[active] ?? { input: "" }); // textarea for the current case

  return (
    <div className="h-full flex flex-col">
      {/* Header row: tabs + (+ / delete) on the LEFT, Reset on the RIGHT */}
      <div className="mb-2 flex items-center">
        <Tabs
          value={`case-${active}`}
          onValueChange={(v) => setActive(parseInt(v.split("-")[1]!, 10))}
        >
          <TabsList className="h-9">
            {cases.map((_, i) => (
              <TabsTrigger
                key={i}
                value={`case-${i}`}
                className="group relative px-3 pr-4 hover:cursor-pointer"
              >
                {`Case ${i + 1}`}
                {cases.length > 1 && (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove Case ${i + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      removeAt(i);
                    }}
                    className="
                      absolute -top-2 -right-1 h-4 w-4 rounded-full
                      flex items-center justify-center 
                      bg-muted/70 hover:bg-muted/90
                      border border-border
                      opacity-0 group-hover:opacity-100 data-[state=active]:opacity-100
                    "
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Left-side controls */}
        {!reachedLimit && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 hover:cursor-pointer"
                  onClick={addCase}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Clone current test case
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Right-side Reset */}
        <div className="ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:cursor-pointer"
                  disabled={resetDisabled}
                  aria-label="Reset test cases to defaults"
                  onClick={doReset}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                Reset test cases to defaults
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Active case editor */}
      <div className="space-y-2">
        {fieldNames.map((name) => (
          <div key={name} className="space-y-1">
            <div className="text-sm text-muted-foreground">{name} =</div>
            <Textarea
              rows={1}
              className="font-mono bg-muted/30 resize-none min-h-0! h-10"
              value={cases[active]?.[name] ?? ""}
              onChange={(e) => updateField(name, e.target.value)}
              spellCheck={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
