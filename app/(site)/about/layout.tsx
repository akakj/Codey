// app/about/layout.tsx
import React, { ReactNode } from "react";

interface AboutLayoutProps {
  children: ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <section
      className={
        `
        fixed
        inset-0
        -z-10
        min-h-screen

        bg-gradient-to-br
        from-green-200
        via-blue-200
        to-white
        bg-[length:200%_200%]
        animate-gradient

        text-gray-900

        dark:bg-gradient-to-br
        dark:from-blue-700
        dark:via-indigo-800
        dark:to-purple-900
        dark:bg-[length:200%_200%]
        dark:animate-gradient

        dark:text-white
      `
      }
    >
      <div className="pt-20 sm:px-15 xs:px-10 md:px-30 lg:px-40">{children}</div>
    </section>
  );
}
