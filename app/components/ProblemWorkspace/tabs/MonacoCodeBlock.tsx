"use client";

import Editor from "@monaco-editor/react";
import type { Lang } from "@/lib/languages";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const monacoId = (L: Lang) => (L === "python3" ? "python" : L);

export function MonacoCodeBlock({
  code,
  lang,
  height = 460,
}: {
  code: string;
  lang: Lang;
  height?: number;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const editorTheme = mounted && resolvedTheme === "dark" ? "vs-dark" : "vs";

  return (
    <div className="rounded-md border overflow-hidden" style={{ height }}>
      <Editor
        key={lang}
        height="100%"
        language={monacoId(lang)}
        value={code}
        theme={editorTheme}
        options={{
          readOnly: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          wordWrap: "off",
          tabSize: 2,
          fontSize: 14,
          smoothScrolling: true,
          cursorBlinking: "phase",
          renderWhitespace: "selection",
          mouseWheelZoom: true,

          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            alwaysConsumeMouseWheel: true
          },
        }}
      />
    </div>
  );
}