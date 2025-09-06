"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { validatePassword } from "@/lib/password";

export type ChangePwState = { ok: boolean; message: string } | null;

export async function changePasswordAction(
  _prev: ChangePwState,
  formData: FormData
): Promise<ChangePwState> {
  const supabase = await createClient();

  // must be logged in
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) {
    return { ok: false, message: "Please sign in to change your password." };
  }

  const email = userRes.user.email ?? "";

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!next) {
    return { ok: false, message: "New password cannot be empty." };
  }
  if (next !== confirm) {
    return { ok: false, message: "Passwords do not match." };
  }
  if (current && next === current) {
    return {
      ok: false,
      message: "New password must be different from your current password.",
    };
  }

  const strength = validatePassword(next, email);
  if (!strength.ok) {
    return { ok: false, message: strength.message };
  }

  if (current) {
    const { error: verifyErr } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    });
    if (verifyErr) {
      return { ok: false, message: "Current password is incorrect." };
    }
  }

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) return { ok: false, message: error.message };

  return { ok: true, message: "Your password has been updated successfully." };
}
