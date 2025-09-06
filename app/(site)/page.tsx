import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  return (
    <div
      className="
          min-h-screen
          flex items-center justify-center
          text-black dark:text-white
          transition-all duration-300
        "
    >
      {user ? (
        <div>
          <p>Welcome back! Here is your progress so far</p>
        </div>
         
        ) : (
          <div>
            <p>What is Codey?</p>
          </div>
        )}
    </div>
  );
}
