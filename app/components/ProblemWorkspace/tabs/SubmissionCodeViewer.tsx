"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

function toMonacoLanguage(language: string) {
  switch (language) {
    case "python3":
      return "python";
    case "javascript":
      return "javascript";
    case "java":
      return "java";
    case "csharp":
      return "csharp";
    default:
      return "plaintext";
  }
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

  return (
    <div className="h-[420px] overflow-hidden rounded-md border">
      <Editor
        height="100%"
        language={toMonacoLanguage(language)}
        value={code}
        theme={editorTheme}
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          lineNumbers: "on",
          folding: true,
          fontSize: 14,
          tabSize: 2,
          renderWhitespace: "selection",
          contextmenu: true,
        }}
      />
    </div>
  );
}