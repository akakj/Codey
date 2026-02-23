import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

const API = axios.create({
  baseURL: "https://api.jdoodle.com/v1",
  headers: { "Content-Type": "application/json" },
});

export async function POST(req: Request) {
  const { script, language, versionIndex = "0", stdin = "" } = await req.json();

  if (!script || typeof script !== "string") {
    return NextResponse.json({ error: "Missing script" }, { status: 400 });
  }
  if (!language || typeof language !== "string") {
    return NextResponse.json({ error: "Missing language" }, { status: 400 });
  }

  try {
    const r = await API.post("/execute", {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script,
      stdin,
      language,
      versionIndex,
    });

    return NextResponse.json(r.data);
  } catch (e: any) {
    const status = e?.response?.status ?? 500;
    const data = e?.response?.data ?? { error: String(e?.message ?? e) };
    return NextResponse.json(data, { status });
  }
}