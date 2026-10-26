"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { HealthResponse } from "@/lib/api";

interface HeaderProps {
  health: HealthResponse | null;
  checkingHealth: boolean;
  onRefreshHealth: () => void;
}

export default function Header({ health, checkingHealth, onRefreshHealth }: HeaderProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 shadow-md shadow-teal-500/20 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                TailorCraft
              </span>
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                AI Resume Customizer
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Tailor your resume to any Job Description with zero hallucination
            </p>
          </div>
        </div>

        {/* Status badges & Dark Mode Toggle */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 text-xs">
          <div className="hidden md:flex items-center space-x-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/50">
            <span className="text-slate-500 dark:text-slate-400">LLM Engine:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center space-x-1">
              <span>Groq Llama 3.3</span>
            </span>
          </div>

          <div
            onClick={onRefreshHealth}
            title="Click to re-check backend connection"
            className={`flex items-center space-x-1.5 rounded-full px-3 py-1 font-medium transition cursor-pointer ${
              health
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                : "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                health ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span>{checkingHealth ? "Checking..." : health ? "API Online" : "Backend Offline"}</span>
            <RefreshCw className={`h-3 w-3 ml-0.5 opacity-60 ${checkingHealth ? "animate-spin" : ""}`} />
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {mounted ? (
              isDark ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600 transition-transform duration-200 rotate-0 hover:-rotate-12" />
              )
            ) : (
              <span className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
