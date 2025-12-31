"use client";
import * as Portal from "@radix-ui/react-portal";
import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <Portal.Root>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center 
                  bg-white/20 dark:bg-slate-950/20 
                  backdrop-blur-md transition-all duration-500 w-full"
      >
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/50 backdrop-blur-md transition-opacity duration-500" />

        <div className="relative flex flex-col items-center justify-center">
          {/* 2. Soft Background Aura (Pulsing Glow) */}
          <div className="absolute w-24 h-24 bg-purple-500/10 dark:bg-purple-400/5 rounded-full blur-2xl animate-pulse" />

          {/* 3. The Main Loader Container */}
          <div className="relative flex items-center justify-center">
            {/* Subtle Outer Border ring */}
            <div className="absolute w-12 h-12 rounded-full border border-slate-200/50 dark:border-slate-800/50" />

            {/* Main Spinning Element - Minimalist Gradient Stroke */}
            <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-purple-600 dark:border-t-purple-400 animate-spin" />

            {/* Center Icon */}
            <div className="absolute">
              <Loader className="w-4 h-4 text-purple-600/50 dark:text-purple-400/50 animate-spin" />
            </div>
          </div>

          {/* 4. Text Content - Modern & Minimalist */}
          <div className="mt-5 flex flex-col items-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 animate-pulse">
              Loading
            </span>

            {/* Progress Bar (Tiny and subtle) */}
            <div className="mt-2 w-8 h-[1px] bg-slate-200 dark:bg-slate-800 overflow-hidden rounded-full">
              {/* Using a Tailwind arbitrary animation to avoid the need for <style jsx> */}
              <div className="h-full bg-purple-500 w-1/2 rounded-full animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </Portal.Root>
  );
}