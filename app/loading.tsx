"use client";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-screen 
                 bg-gradient-to-b from-gray-50 to-gray-100 
                 dark:from-slate-950 dark:to-slate-900
                 transition-colors duration-500"
    >
      <div className="relative flex items-center justify-center">
        {/* outer spinning ring */}
        <div
          className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 
                     rounded-full border-4 border-transparent border-t-blue-500 
                     animate-spin"
        />
        {/* soft glow ring */}
        <div
          className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 
                     rounded-full blur-lg bg-blue-500/20"
        />

        <Loader2
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 
                     text-blue-500 dark:text-blue-400 animate-spin-slow"
        />
      </div>
    </div>
  );
}
