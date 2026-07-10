"use client";

import Editor from "@monaco-editor/react";
import type { Lang } from "@/lib/languages";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

const monacoId = (L: Lang) => (L === "python3" ? "python" : L);

function getEditorHeight(code: string, fontSize: number) {
  const lineCount = Math.max(code.split(/\r\n|\r|\n/).length, 1);

  const lineHeight = Math.max(fontSize + 8, 22);
  const verticalPadding = 24;
  const minHeight = 120;

  return Math.max(minHeight, lineCount * lineHeight + verticalPadding);
}

export function MonacoCodeBlock({
  code,
  lang,
  height,
  fontSize = 14,
}: {
  code: string;
  lang: Lang;
  height?: number;
  fontSize?: number;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const editorTheme = mounted && resolvedTheme === "dark" ? "vs-dark" : "vs";

  const editorHeight = useMemo(
    () => height ?? getEditorHeight(code, fontSize),
    [code, fontSize, height],
  );

  return (
    <div
      className="rounded-md border overflow-hidden"
      style={{ height: editorHeight }}
    >
      <Editor
        key={lang}
        height={editorHeight}
        language={monacoId(lang)}
        value={code}
        theme={editorTheme}
        options={{
          readOnly: true,
          domReadOnly: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          wordWrap: "off",
          tabSize: 2,
          fontSize,
          lineHeight: Math.max(fontSize + 8, 22),
          smoothScrolling: true,
          renderWhitespace: "selection",
          contextmenu: true,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            vertical: "hidden",
            horizontal: "auto",
            alwaysConsumeMouseWheel: false,
          },
        }}
      />
    </div>
  );
}