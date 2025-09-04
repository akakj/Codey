import React from "react";
import Link from "next/link";
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

  const email = data.user.email ?? "";

  return (
    <AccountClient email={data.user.email ?? ''} />
  );
}
