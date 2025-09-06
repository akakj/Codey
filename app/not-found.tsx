import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Sorry, we couldn’t find that page.
      </p>

      <p className="mt-6">Try the links below or search:</p>
      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/"
          className="text-blue-800 hover:underline dark:text-blue-200"
        >
          ← Back to Home
        </Link>
        <Link
          href="/problems"
          className="text-blue-800 hover:underline dark:text-blue-200"
        >
          Browse Problems
        </Link>
        <Link
          href="/about"
          className="text-blue-800 hover:underline dark:text-blue-200"
        >
          About Codey
        </Link>
        <Link
          href="/account"
          className="text-blue-800 hover:underline dark:text-blue-200"
        >
          Your Account
        </Link>
      </div>
    </div>
  );
}
