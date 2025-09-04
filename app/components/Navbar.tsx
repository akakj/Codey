import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 inset-x-0 bg-white dark:bg-[#111111] shadow-sm h-16 z-50 flex items-center justify-between px-4 rounded-b-sm">
      {/* Left: logo + main links */}
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/home-icon.png"
            alt="Home"
            width={32}
            height={32}
            priority
          />
        </Link>
        <Link
          href="/problems"
          className="text-gray-600 hover:text-gray-900 dark:text-[#c9c6c5] dark:hover:text-white transition-colors"
        >
          Problems
        </Link>
        <Link
          href="/about"
          className="text-gray-600 hover:text-gray-900 dark:text-[#c9c6c5] dark:hover:text-white transition-colors"
        >
          About
        </Link>
      </div>

      {/* Right: theme toggle + account/login */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {user ? (
          <Link
            href="/account"
            className="text-gray-600 hover:text-gray-900 dark:text-[#c9c6c5] dark:hover:text-white transition-colors"
          >
            Account
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-gray-600 hover:text-gray-900 dark:text-[#c9c6c5] dark:hover:text-white transition-colors"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
