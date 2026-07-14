"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import {
  LANGS,
  type Lang,
  type StarterMap,
  isLang,
  pickInitialLang,
} from "@/lib/languages";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { EditorToolbar } from "./EditorToolbar";
import { ConsolePanel } from "./ConsolePanel";
import type { EditableTestCase, EntryPointByLang } from "@/lib/problem";
import { getLastSubmittedCode } from "./getLastSubmittedCode";

const LANG_STORAGE_KEY = "Codey:lastLanguage";
const CODE_NS = "Codey:code";
const codeKey = (slug: string, lang: Lang) => `${CODE_NS}:${slug}:${lang}`;

export default function CodeEditor({
  isLoggedIn,
  problemSlug,
  starterCodeByLang = {},
  onLanguageChange,
  initialConsoleOpen = true,
  initialCases,
  entryPointByLang,
}: {
  isLoggedIn: boolean;
  problemSlug: string;
  starterCodeByLang?: StarterMap;
  onLanguageChange?: (lang: Lang) => void;
  initialConsoleOpen?: boolean;
  initialCases?: EditableTestCase[];
  entryPointByLang?: EntryPointByLang;
}) {
  const starters = starterCodeByLang;

  const [lang, setLang] = useState<Lang>("javascript");
  const [codeByLang, setCodeByLang] = useState<Partial<Record<Lang, string>>>(
    {}
  );

   const [isRetrievingLastSubmission, setIsRetrievingLastSubmission] =
    useState(false);


  // seed code & choose initial language
  useEffect(() => {
    if (typeof window === "undefined") return;

    const seeded: Partial<Record<Lang, string>> = {};
    LANGS.forEach((L) => {
      const saved = localStorage.getItem(codeKey(problemSlug, L));
      seeded[L] = saved ?? starters[L] ?? "";
    });
    setCodeByLang(seeded);

    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    const initial =
      savedLang &&
      isLang(savedLang) &&
      (starters[savedLang] ?? seeded[savedLang]) !== undefined
        ? (savedLang as Lang)
        : pickInitialLang(starters);
    setLang(initial);
  }, [problemSlug, starters]);

  // persist edits (debounced)
  const saveTimer = useRef<number | null>(null);
  const persist = (text: string) => {
    try {
      // optional: keep storage clean if equal to starter
      const starter = starters[lang] ?? "";
      const key = codeKey(problemSlug, lang);
      if (text === "" || text === starter) localStorage.removeItem(key);
      else localStorage.setItem(key, text);
    } catch {}
  };
  const handleCodeChange = (value?: string) => {
    const text = value ?? "";
    setCodeByLang((prev) =>
      prev[lang] === text ? prev : { ...prev, [lang]: text }
    );
    if (typeof window !== "undefined") {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => persist(text), 250);
    }
  };

  const handleLangChange = (next: Lang) => {
    if (next === lang) return;
    setLang(next);
    if (typeof window !== "undefined")
      localStorage.setItem(LANG_STORAGE_KEY, next);
    onLanguageChange?.(next);
  };

  const handleRetrieveLastSubmission = async () => {
  if (!isLoggedIn) {
    window.alert("Log in to retrieve your last submitted code.");
    return;
  }

  setIsRetrievingLastSubmission(true);

  try {
    const result = await getLastSubmittedCode(problemSlug);

    if (!result.ok) {
      window.alert(result.message);
      return;
    }

    // Prevent a pending localStorage save from overwriting the retrieved code.
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    const retrievedLanguage = result.language;
    const retrievedCode = result.code;

    // Switch the editor to the language used for the latest submission.
    if (retrievedLanguage !== lang) {
      handleLangChange(retrievedLanguage);
    }

    // Put the retrieved code into the editor state.
    setCodeByLang((previous) => ({
      ...previous,
      [retrievedLanguage]: retrievedCode,
    }));

    // Persist it using the editor's existing localStorage structure.
    try {
      const key = codeKey(problemSlug, retrievedLanguage);
      const starter = starters[retrievedLanguage] ?? "";

      if (retrievedCode === "" || retrievedCode === starter) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, retrievedCode);
      }
    } catch {
      // The editor still updates even if localStorage is unavailable.
    }
  } catch (error) {
    console.error("Could not retrieve last submitted code:", error);
    window.alert("Could not retrieve your last submitted code.");
  } finally {
    setIsRetrievingLastSubmission(false);
  }
};

  // Reset current language to starter
  const currentStarter = starters[lang] ?? "";
  const currentText = codeByLang[lang] ?? currentStarter;
  const canReset = !!currentStarter && currentText !== currentStarter;

  const handleReset = React.useCallback(() => {
    if (!currentStarter) return;

    // making sure to cancel any pending saves
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    // set code back to starter
    setCodeByLang((prev) => ({ ...prev, [lang]: currentStarter }));

    // clear persisted override so future loads fall back to starter
    try {
      localStorage.removeItem(codeKey(problemSlug, lang));
    } catch {}
  }, [currentStarter, lang, problemSlug]);
  const value = codeByLang[lang] ?? currentStarter;

  // theme
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const editorTheme = mounted && resolvedTheme === "dark" ? "vs-dark" : "vs";

  const monacoId = (L: Lang) => (L === "python3" ? "python" : L);

  return (
    <div className="flex h-full flex-col">
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="flex h-full flex-col">
            <EditorToolbar
              lang={lang}
              starters={starters}
              onLangChange={handleLangChange}
              onReset={handleReset}
              canReset={canReset}
              onRetrieveLastSubmission={handleRetrieveLastSubmission}
              isRetrievingLastSubmission={isRetrievingLastSubmission}
            />

            <div className="flex-1 overflow-hidden rounded-md border">
              <Editor
                height="100%"
                language={monacoId(lang)}
                value={value}
                onChange={handleCodeChange}
                theme={editorTheme}
                options={{
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  minimap: { enabled: false },
                  wordWrap: "on",
                  tabSize: 2,
                  fontSize: 14,
                  smoothScrolling: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  cursorBlinking: "phase",
                  renderWhitespace: "selection",
                  mouseWheelZoom: true,
                }}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ConsolePanel
          isLoggedIn={isLoggedIn}
          initialOpen={initialConsoleOpen}
          value={value}
          language={lang}
          problemSlug={problemSlug}    
          initialCases={initialCases}
          entryPointByLang={entryPointByLang}
          starterCodeByLang={starterCodeByLang}
        />
      </ResizablePanelGroup>
    </div>
  );
}
