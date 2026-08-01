import Image from "next/image";
import Link from "next/link";
import { Settings, LogOutIcon, FileClock } from "lucide-react";

import { signOut } from "@/app/(site)/account/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/server";

import { ThemeToggle } from "./ThemeToggle";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between rounded-b-sm bg-white px-4 shadow-sm dark:bg-[#111111]">
      <div className="flex items-center space-x-8">
        <Link href="/" className="shrink-0">
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
          className="text-gray-600 transition-colors hover:text-gray-900 dark:text-[#c9c6c5] dark:hover:text-white"
        >
          Problems
        </Link>

        <Link
          href="/about"
          className="text-gray-600 transition-colors hover:text-gray-900 dark:text-[#c9c6c5] dark:hover:text-white"
        >
          About
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />

        {user ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-md px-1 hover:cursor-pointer text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-[#c9c6c5] dark:hover:text-white"
              >
                Account
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-48"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/account" className="cursor-pointer">
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/submission-history"
                  className="cursor-pointer"
                >
                  <FileClock />
                  Submission History
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <form action={signOut} className="w-full">
                <DropdownMenuItem asChild variant="destructive">
                  <button
                    type="submit"
                    className="w-full cursor-pointer"
                  >
                    <LogOutIcon />
                    Log out
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            className="text-gray-600 transition-colors hover:text-gray-900 dark:text-[#c9c6c5] dark:hover:text-white"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}