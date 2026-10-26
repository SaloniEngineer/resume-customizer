"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, FileSearch, Cpu, CheckCircle2, ShieldCheck, FileCheck } from "lucide-react";

const STEPS = [
  { icon: FileSearch, label: "Extracting text with PyMuPDF & python-docx..." },
  { icon: Cpu, label: "Analyzing Job Description requirements & semantic keywords..." },
  { icon: Sparkles, label: "Groq Llama 3.3 rewriting summary & prioritizing skills..." },
  { icon: ShieldCheck, label: "Enforcing zero-hallucination constraint & verifying truth..." },
  { icon: FileCheck, label: "Calculating ATS match score & formatting resume..." },
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-slate-200/90 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 max-w-xl mx-auto my-6">
      {/* Animated badge */}
      <div className="relative mb-6">
        <div className="absolute -inset-2 rounded-full bg-teal-500/20 blur-lg animate-pulse" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-lg shadow-teal-500/30">
          <Sparkles className="h-8 w-8 animate-spin" style={{ animationDuration: "6s" }} />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Tailoring Resume to Job Description
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        Our AI pipeline is analyzing ATS keywords, optimizing action verbs, and matching qualifications.
      </p>

      {/* Progress Steps */}
      <div className="w-full mt-6 space-y-2.5 text-left max-w-md">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 p-2.5 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? "bg-teal-50/80 border border-teal-200 text-teal-900 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-200"
                  : isDone
                  ? "text-slate-600 dark:text-slate-400 opacity-80"
                  : "text-slate-300 dark:text-slate-700 opacity-40"
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Icon
                    className={`h-4 w-4 ${
                      isCurrent ? "text-teal-600 dark:text-teal-400 animate-bounce" : ""
                    }`}
                  />
                )}
              </div>
              <span className="text-xs font-medium flex-1 truncate">{step.label}</span>
              {isCurrent && (
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-600 animate-ping" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3 w-full">
        Tip: TailorCraft strictly preserves your genuine dates, metrics, and background with zero fabrication.
      </div>
    </div>
  );
}
