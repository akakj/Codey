import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) redirect("/");

  return <LoginClient />;
}
