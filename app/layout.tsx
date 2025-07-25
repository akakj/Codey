import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Codey',
  description: 'A Leetcode-like platform for coding challenges',
  icons: {
    // the classic favicon.ico
    icon: '/favicon.ico',

    // Windows “shortcut icon” (same as rel="icon" in many contexts)
    shortcut: '/favicon-32x32.png',

    // iOS home-screen icon
    apple: '/apple-touch-icon.png',

    // any other custom icons—e.g. Safari “pinned tab” mask icon:
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000" }
    ]
    
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Navbar />
        <main className = "pt-16 min-h-screen">
          {children}
        </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
