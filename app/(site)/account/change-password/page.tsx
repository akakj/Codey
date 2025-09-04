import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ChangePasswordClient from "@/app/components/client/ChangePasswordClient";

export default async function ChangePasswordPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect(`/login?next=/account/change-password`);
  }
  return <ChangePasswordClient />;
}
