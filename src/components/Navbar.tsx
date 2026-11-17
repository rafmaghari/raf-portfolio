"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const navigation = [
    { name: "About", href: "#about" },
    { name: "Tech stack", href: "#skills" },
    { name: "Projects", href: "#portfolio" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-[#fafaf9]/90 dark:bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Raf Maghari, home"
            className="text-zinc-900 dark:text-white [--rm-cutout:#fafaf9] dark:[--rm-cutout:#18181b]"
          >
            <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32">
              <rect x="1" y="1" width="30" height="30" rx="7" fill="currentColor" />
              <g fill="var(--rm-cutout, #fafaf9)">
                <path fillRule="evenodd" d="M5 8h5.5a4.5 4.5 0 0 1 2.8 8L17 24h-3.6l-3.2-7H8v7H5V8zm3 3v3h2.5a1.5 1.5 0 0 0 0-3H8z" />
                <path d="M18 24V8h2.5l3 5 3-5H29v16h-3v-9l-2.5 4-2.5-4v9h-3z" />
              </g>
            </svg>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-700"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-zinc-700 dark:text-zinc-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2 space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
