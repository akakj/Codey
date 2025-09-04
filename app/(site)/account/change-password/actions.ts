"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export type ChangePwState = { ok: boolean; message: string } | null;

export async function changePasswordAction(
  _prev: ChangePwState,
  formData: FormData
): Promise<ChangePwState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data?.user) {
    return { ok: false, message: "Please sign in to change your password." };
  }

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!next) {
    return { ok: false, message: "New password cannot be empty." };
  }
  if (next !== confirm) {
    return { ok: false, message: "Passwords do not match." };
  }

  // must be logged in
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) redirect("/login");

  if (current) {
    const { error: verifyErr } = await supabase.auth.signInWithPassword({
      email: userRes.user.email!,
      password: current,
    });
    if (verifyErr)
      return { ok: false, message: "Current password is incorrect." };
  }

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) return { ok: false, message: error.message };

  return { ok: true, message: 'Your password has been updated successfully.' };
}
