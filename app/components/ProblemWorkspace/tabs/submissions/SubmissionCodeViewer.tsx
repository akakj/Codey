"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

function toMonacoLanguage(language: string) {
  return language === "python3" ? "python" : language;
}

function getEditorHeight(code: string) {
  const lineHeight = 22;
  const verticalPadding = 24;
  const minHeight = 120;

  const lineCount = Math.max(code.split("\n").length, 1);

  return Math.max(minHeight, lineCount * lineHeight + verticalPadding);
}

export default function SubmissionCodeViewer({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const editorTheme = mounted && resolvedTheme === "dark" ? "vs-dark" : "vs";
  const editorHeight = getEditorHeight(code);

  return (
    <div className="overflow-hidden rounded-md border">
      <Editor
        height={editorHeight}
        language={toMonacoLanguage(language)}
        value={code}
        theme={editorTheme}
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "off",
          lineNumbers: "on",
          folding: true,
          fontSize: 14,
          lineHeight: 22,
          tabSize: 2,
          renderWhitespace: "selection",
          contextmenu: true,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            vertical: "hidden",
            horizontal: "auto",
          },
        }}
      />
    </div>
  );
}