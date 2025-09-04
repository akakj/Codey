import React from 'react';
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser()
  return (
    <div
      className="
          min-h-screen
          flex items-center justify-center
          text-black dark:text-white
          transition-all duration-300
        "
    >
      <h1 className="">Hello!</h1>
    </div>
  );
}
