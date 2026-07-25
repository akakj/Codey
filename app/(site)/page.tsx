import GuestHome from "./components/GuestHome";
import { createClient } from "@/utils/supabase/server";
import UserAnalytics from "./components/UserAnalytics";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  
  if (!user) {
    return <GuestHome />;
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] px-6 py-12 sm:px-8     ">
      <div className="mx-auto max-w-6xl ">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back!
        </h1>

        <p className="mt-2 text-muted-foreground">
          Here is your problem-solving progress so far
        </p>

        <UserAnalytics userId={user.id} />
      </div>
    </main>
  );
}
