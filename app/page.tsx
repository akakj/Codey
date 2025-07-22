import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Background layer */}
      <div
        className="
          fixed inset-0
          -z-10
          bg-white dark:bg-gray-800
          transition-all duration-300
        "
      />

      {/* Content layer */}
      <div
        className="
          min-h-screen
          flex items-center justify-center
          text-black dark:text-white
          transition-all duration-300
        "
      >
        <h1>Hello World!</h1>
      </div>
    </>
  );
}
