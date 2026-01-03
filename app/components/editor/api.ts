import axios from "axios";
import { LANGS_VERSIONS, type Lang } from "@/lib/languages";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
  headers: { "Content-Type": "application/json" },
});

function toPistonLanguage(lang: Lang): string {
  return lang === "python3" ? "python" : lang; // always returns a string
}

export async function executeCode(language: Lang, sourceCode: string) {
  const pistonLanguage = toPistonLanguage(language);
  const version = LANGS_VERSIONS[language];
  
  const response = await API.post("/execute", {
    language: pistonLanguage,
    version,
    files: [{ content: sourceCode }],
    stdin: "",
  });

  return response.data;
}
