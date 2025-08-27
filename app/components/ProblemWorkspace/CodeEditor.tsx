"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  LANGS,
  type Lang,
  type StarterMap,
  DISPLAY_NAME,
  isLang,
  pickInitialLang,
} from "@/lib/languages";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ConsoleCases from "./ConsoleCases";
import { CircleQuestionMark, Play, CloudUpload, ChevronDown } from "lucide-react";

const LANG_STORAGE_KEY = "Codey:lastLanguage"; // last used language
const CODE_NS = "Codey:code";
const codeKey = (slug: string, lang: Lang) => `${CODE_NS}:${slug}:${lang}`;

export default function CodeEditor({
  problemSlug,
  starterCodeByLang = {},
  onLanguageChange,
  initialConsoleOpen = true,
}: {
  problemSlug: string;
  starterCodeByLang?: StarterMap;
  onLanguageChange?: (lang: Lang) => void;
  initialConsoleOpen?: boolean;
}) {
  
 const starters = starterCodeByLang; // a reference

  const [lang, setLang] = useState<Lang>("javascript");  // language (remember last, fall back to first available or JS)

  const [codeByLang, setCodeByLang] = useState<Partial<Record<Lang, string>>>({}); // per-language text

  // Seed code (saved -> starter) and choose initial language
  useEffect(() => {
    if (typeof window === "undefined") return;

    // build map once per problem
    const seeded: Partial<Record<Lang, string>> = {};
    LANGS.forEach((L) => {
      const saved = localStorage.getItem(codeKey(problemSlug, L));
      seeded[L] = saved ?? starters[L] ?? "";
    });
    setCodeByLang(seeded);

    // pick initial language (saved + available -> default order -> JS)
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    const initial =
      savedLang && isLang(savedLang) && (starters[savedLang] ?? seeded[savedLang]) !== undefined
        ? (savedLang as Lang)
        : pickInitialLang(starters);
    setLang(initial);
  }, [problemSlug]); // keyed only to slug to avoid re-running on object identity changes

  // Save code changes (debounced) per problem+lang
  const saveTimer = useRef<number | null>(null);
  const persist = (text: string) => {
    try {
      localStorage.setItem(codeKey(problemSlug, lang), text);
    } catch {
      /* ignore quota errors */
    }
  };

  const handleCodeChange = (value?: string) => {
    const text = value ?? "";
    setCodeByLang((prev) => (prev[lang] === text ? prev : { ...prev, [lang]: text }));

    if (typeof window !== "undefined") {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => persist(text), 250);
    }
  };

  const handleLangChange = (next: Lang) => {
    if (next === lang) return;
    setLang(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    }
    onLanguageChange?.(next);
  };

  const value = codeByLang[lang] ?? starters[lang] ?? "";

  // theme + rounded editor
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const editorTheme = mounted && resolvedTheme === "dark" ? "vs-dark" : "vs";

  const monacoId = (L: Lang) => (L === "python3" ? "python" : L);

  const [consoleOpen, setConsoleOpen] = useState(initialConsoleOpen);
  const [output, setOutput] = useState("Run to see output…");

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b bg-muted/10 dark:bg-muted/30 px-2 py-1">
        <Select value={lang} onValueChange={(v) => handleLangChange(v as Lang)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {LANGS.map((L) => (
                <SelectItem key={L} value={L} disabled={!starters[L]}>
                  {DISPLAY_NAME[L]} {!starters[L] && "(unavailable)"}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <CircleQuestionMark className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="start">
              <span>Tip: Hold <b>⌘/Ctrl </b> and <b>scroll </b>to zoom editor text</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Monaco */}
      <div className="flex-1 rounded-md overflow-hidden">
        <Editor
          height="100%"
          language={monacoId(lang)}
          value={value}
          onChange={handleCodeChange}
          theme={editorTheme}
          options={{
            automaticLayout: true, // remeasure on container resize
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            wordWrap: "on",
            tabSize: 2,
            fontSize: 14, // change on smaller screens
            smoothScrolling: true,
            formatOnPaste: true,
            formatOnType: true,
            cursorBlinking: "phase",
            renderWhitespace: "selection",
            mouseWheelZoom: true,
          }}
        />
      </div>

      <Collapsible open={consoleOpen} onOpenChange={setConsoleOpen} className="border-t">
        {/* Console header row — stays visible when collapsed */}
        <div className="flex items-center justify-between px-3 py-2 bg-muted/20">
          <Tabs defaultValue="cases" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="rounded-none bg-transparent p-0 h-auto border-0">
                <TabsTrigger value="cases" className="px-3 py-1.5">Testcase</TabsTrigger>
                <span className="mx-2 text-muted-foreground">|</span>
                <TabsTrigger value="output" className="px-3 py-1.5">Test Result</TabsTrigger>
              </TabsList>

              {/* The chevron is the trigger */}
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle console"
                  className="h-7 w-7 transition-transform data-[state=open]:rotate-180"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>

            {/* Collapsible content = the body below the header */}
            <CollapsibleContent className="mt-2 border-t">
              <div className="h-[25vh] min-h-[180px] overflow-auto p-2">
                <TabsContent value="cases" className="m-0 h-full">
                  <ConsoleCases />
                </TabsContent>
                <TabsContent value="output" className="m-0 h-full">
                  <pre className="text-sm whitespace-pre-wrap">{output}</pre>
                </TabsContent>
              </div>
            </CollapsibleContent>
          </Tabs>
        </div>
      </Collapsible>
    </div>
  );
}
