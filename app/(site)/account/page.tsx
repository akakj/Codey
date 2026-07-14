import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AccountClient } from "@/app/components/client/AccountClient";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <AccountClient email={data.user.email ?? ''} />
  );
}
