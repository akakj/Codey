import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

type ExecuteRequest = {
  script: string;
  language: string;
  versionIndex: string;
  stdin: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseExecuteRequest(value: unknown): ExecuteRequest | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.script !== "string" ||
    value.script.length === 0 ||
    typeof value.language !== "string" ||
    value.language.length === 0
  ) {
    return null;
  }

  return {
    script: value.script,
    language: value.language,
    versionIndex:
      typeof value.versionIndex === "string"
        ? value.versionIndex
        : "0",
    stdin:
      typeof value.stdin === "string"
        ? value.stdin
        : "",
  };
}

function getAxiosErrorBody(
  error: unknown,
): Record<string, unknown> {
  if (
    axios.isAxiosError<unknown>(error) &&
    isRecord(error.response?.data)
  ) {
    return error.response.data;
  }

  return {
    error:
      error instanceof Error
        ? error.message
        : "JDoodle request failed",
  };
}

const API = axios.create({
  baseURL: "https://api.jdoodle.com/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function POST(request: Request) {
  const rawBody: unknown = await request
    .json()
    .catch(() => null);

  const body = parseExecuteRequest(rawBody);

  if (!body) {
    if (
      !isRecord(rawBody) ||
      typeof rawBody.script !== "string" ||
      rawBody.script.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing script" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Missing language" },
      { status: 400 },
    );
  }

  try {
    const response = await API.post<unknown>("/execute", {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: body.script,
      stdin: body.stdin,
      language: body.language,
      versionIndex: body.versionIndex,
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const status = axios.isAxiosError(error)
      ? (error.response?.status ?? 500)
      : 500;

    return NextResponse.json(
      getAxiosErrorBody(error),
      { status },
    );
  }
}