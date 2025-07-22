// app/about/layout.tsx
import React, { ReactNode } from "react";

interface AboutLayoutProps {
  children: ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <section
      className="
        fixed 
        inset-0 
        -z-10 
        min-h-screen
        
        bg-gradient-to-br 
        from-green-200 
        via-blue-200 
        to-white 
        text-gray-900

        dark:bg-gradient-to-br 
        dark:from-blue-700 
        dark:via-indigo-800 
        dark:to-purple-900 
        dark:text-white
      "
    >
      <div className="pt-20 px-5 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
