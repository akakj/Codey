import React, { ReactNode } from "react";

interface AboutLayoutProps {
  children: ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <section
      className={`
        fixed
        inset-0
        -z-10
        min-h-screen

        text-gray-900

        dark:text-white
      `}
    >
      <div className="pt-20 sm:px-15 xs:px-10 md:px-30 lg:px-40">
        {children}
      </div>
    </section>
  );
}

