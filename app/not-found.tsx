"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 transition-colors duration-300 
      bg-gradient-to-b from-gray-100 to-white text-gray-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-50"
    >
      <div
        className="max-w-5xl w-full rounded-xs p-10 md:p-14 shadow-none backdrop-blur-md 
        bg-white/70 dark:bg-slate-800/40 grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        {/* Left section */}
        <section>
          <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-slate-400">
            404 — Page not found
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">
            We can't find that page
          </h1>

          <p className="mt-4 text-gray-600 dark:text-slate-300 max-w-xl">
            The link may be broken, the page may have moved, or the address was
            entered incorrectly. Try searching or go back to the homepage.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              className="cursor-pointer rounded-xs text-white bg-teal-500 hover:bg-teal-600 dark:bg-teal-900 dark:hover:bg-teal-950 
                focus:outline-none focus:ring-0 transition"
              onClick={() => router.back()}
            >
              Back to Previous Page
            </Button>
          </div>
        </section>

        {/* Right visual */}
        <aside className="flex items-center justify-center">
          <div
            className="relative w-52 h-52 md:w-72 md:h-72 rounded-xs 
            bg-gradient-to-br from-emerald-300/30 to-sky-300/10 
            dark:from-emerald-400/20 dark:to-sky-400/10 
            flex items-center justify-center shadow-inner animate-bounce-slow"
          >
            <span className="text-6xl md:text-7xl font-bold">404</span>
            <span className="absolute bottom-3 text-xs text-gray-500 dark:text-slate-400">
              Page not found
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}
