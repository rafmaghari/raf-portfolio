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
    { name: "Skills", href: "#skills" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="section-container py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            RM
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-500"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-500"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
            >
              {theme === "dark" ? (
                <>
                  <SunIcon className="h-5 w-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <MoonIcon className="h-5 w-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
