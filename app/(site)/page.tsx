import GuestHome from "./GuestHome";
import { createClient } from "@/utils/supabase/server";



function AuthenticatedHome() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] px-6 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Welcome back!</h1>

        <p className="mt-3 text-gray-700 dark:text-gray-200">
          Here is your problem-solving progress so far.
        </p>

        {/* Add the authenticated user's progress dashboard here. */}
      </div>
    </div>
  );
}

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? <AuthenticatedHome /> : <GuestHome />;
}
