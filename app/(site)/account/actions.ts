"use server";

import { redirect } from "next/navigation";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

type DeleteAccountState = {
  error: string | null;
};

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}

export async function updateEmail(formData: FormData) {
  const newEmail = String(formData.get("email") ?? "").trim();

  if (!newEmail) {
    return {
      ok: false,
      message: "Email cannot be empty",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: "Email updated. Please verify your new email.",
  };
}

export async function deleteAccount(
  _previousState: DeleteAccountState,
  _formData: FormData,
): Promise<DeleteAccountState> {
  const supabase = await createClient();

  /*
   * Always retrieve the authenticated user on the server.
   * Never accept a user ID from the client for account deletion.
   */
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "You must be signed in to delete your account.",
    };
  }

  try {
  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase.auth.admin.deleteUser(user.id);

  if (error) {
    throw error;
  }
} catch (error) {
  console.error("Account deletion failed:", error);

  return {
    error: "Your account could not be deleted. Please try again.",
  };
}

  /*
   * Deleting an Auth user does not automatically clear the user's
   * current browser session, so also sign out locally.
   */
  await supabase.auth.signOut();

  redirect("/login");
}