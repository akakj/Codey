"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Editor from "@monaco-editor/react";
import { CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  codeExamples,
  previewTestCases,
  type LanguageKey,
} from "./guestHomeData";

export default function CodeEditorPreview() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<LanguageKey>("python");
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [hasRun, setHasRun] = useState(true);

  useEffect(() => setMounted(true), []);

  const editorTheme = mounted && resolvedTheme === "dark" ? "vs-dark" : "vs";
  const selectedExample = codeExamples[language];
  const selectedTestCase = previewTestCases[activeTestCase];

  const changeLanguage = (key: LanguageKey) => {
    setLanguage(key);
    setHasRun(false);
  };

  const changeTestCase = (index: number) => {
    setActiveTestCase(index);
    setHasRun(false);
  };

  return (
    <div className="min-w-0 lg:order-1">
      {/* Mobile testing workflow */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#1e1e1e] md:hidden">
        <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-300 bg-[#e5e7ebd4] px-3 py-2 dark:border-white/10 dark:bg-[#181818]">
          {(Object.keys(codeExamples) as LanguageKey[]).map((key) => {
            const example = codeExamples[key];
            const isActive = language === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => changeLanguage(key)}
                className={`shrink-0 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-white text-gray-950 shadow-sm ring-1 ring-gray-300 dark:bg-white/10 dark:text-white dark:ring-0"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                }`}
              >
                {example.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-4 p-4">
          <div>
            <p className="text-xs font-medium text-gray-800 dark:text-gray-300">
              Test cases
            </p>

            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {previewTestCases.map((testCase, index) => {
                const isActive = activeTestCase === index;

                return (
                  <button
                    key={testCase.label}
                    type="button"
                    onClick={() => changeTestCase(index)}
                    className={`shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "border-gray-300 bg-gray-100 text-gray-950 dark:border-white/15 dark:bg-white/10 dark:text-white"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
                    }`}
                  >
                    {testCase.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-700 dark:text-gray-400">Input</p>
            <pre className="mt-1.5 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs leading-5 text-gray-800 dark:border-white/10 dark:bg-black/20 dark:text-gray-200">
              {selectedTestCase.input}
            </pre>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              onClick={() => setHasRun(true)}
              className="gap-2"
            >
              <Play className="size-3.5 fill-current" />
              Run
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-300 bg-[#e5e7ebd4] p-4 dark:border-white/10 dark:bg-[#181818]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-gray-800 dark:text-gray-300">
              Result
            </p>

            {hasRun ? (
              <div className="flex items-center gap-1.5 text-sm font-medium text-green-800 dark:text-green-400">
                <CheckCircle2 className="size-4" />
                Passed
              </div>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-500">
                Not run
              </span>
            )}
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-700 dark:text-gray-400">Output</p>
            <div className="mt-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-mono text-xs text-gray-800 dark:border-white/10 dark:bg-black/20 dark:text-gray-200">
              {hasRun ? selectedTestCase.output : "Run the test case to see output"}
            </div>
          </div>
        </div>
      </div>

      {/* Tablet/desktop: keep the Monaco-based editor preview. */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#1e1e1e] md:block">
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 bg-[#e5e7ebd4] px-3 py-2 dark:border-white/10 dark:bg-[#181818]">
          {(Object.keys(codeExamples) as LanguageKey[]).map((key) => {
            const example = codeExamples[key];
            const isActive = language === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => changeLanguage(key)}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-white text-gray-950 shadow-sm ring-1 ring-gray-300 dark:bg-white/10 dark:text-white dark:ring-0"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                }`}
              >
                {example.label}
              </button>
            );
          })}
        </div>

        <div className="h-67.5">
          <Editor
            height="100%"
            language={selectedExample.monacoLanguage}
            value={selectedExample.code}
            theme={editorTheme}
            options={{
              readOnly: true,
              domReadOnly: true,
              minimap: { enabled: false },
              lineNumbers: "on",
              folding: false,
              glyphMargin: false,
              lineDecorationsWidth: 8,
              lineNumbersMinChars: 3,
              scrollBeyondLastLine: false,
              renderLineHighlight: "none",
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              contextmenu: false,
              automaticLayout: true,
              fontSize: 13,
              padding: {
                top: 14,
                bottom: 14,
              },
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        </div>

        <div className="grid border-t border-gray-300 bg-[#e5e7ebd4] dark:border-white/10 dark:bg-[#181818] sm:grid-cols-2">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-white/10 sm:border-b-0 sm:border-r">
            <p className="text-xs text-gray-700 dark:text-gray-400">Test case 1</p>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-green-800 dark:text-green-400">
              <CheckCircle2 className="size-4" />
              Passed
            </div>
          </div>

          <div className="px-4 py-3">
            <p className="text-xs text-gray-700 dark:text-gray-400">Test case 2</p>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-green-800 dark:text-green-400">
              <CheckCircle2 className="size-4" />
              Passed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}