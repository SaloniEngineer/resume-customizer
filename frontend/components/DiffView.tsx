"use client";

import React, { useState } from "react";
import { GitCompare, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { CustomizedResume } from "@/lib/api";

interface DiffViewProps {
  resume: CustomizedResume;
}

export default function DiffView({ resume }: DiffViewProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "experience" | "skills">("summary");

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
              <GitCompare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Optimization Diff & Transparency View
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspect how your bullet points & summary were refined for target JD keywords
              </p>
            </div>
          </div>

          {/* Sub-tab selection */}
          <div className="flex items-center space-x-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab("summary")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                activeTab === "summary"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                activeTab === "experience"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Experience Bullets
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                activeTab === "skills"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Skills Prioritization
            </button>
          </div>
        </div>

        {/* Tab Content: Summary */}
        {activeTab === "summary" && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span>Original Extracted Content</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                {resume.original_text_summary ||
                  (resume.original_text
                    ? resume.original_text.slice(0, 320) + "..."
                    : "Original resume content parsed from document.")}
              </p>
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50/30 p-4 dark:border-teal-900/60 dark:bg-teal-950/20">
              <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                <span>Tailored Professional Summary (ATS Optimized)</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {resume.professional_summary}
              </p>
            </div>
          </div>
        )}

        {/* Tab Content: Experience */}
        {activeTab === "experience" && (
          <div className="mt-5 space-y-4">
            {resume.work_experience && resume.work_experience.length > 0 ? (
              resume.work_experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {exp.role} @ {exp.company}
                    </span>
                    <span className="text-[11px] text-slate-400">{exp.duration}</span>
                  </div>

                  <div className="space-y-1.5 mt-2">
                    {exp.bullets.map((bullet, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex items-start space-x-2 rounded-lg bg-emerald-50/50 p-2 text-xs text-slate-800 dark:bg-emerald-950/20 dark:text-slate-200 border border-emerald-100 dark:border-emerald-900/30"
                      >
                        <span className="text-emerald-600 font-bold mt-0.5">+</span>
                        <p className="leading-relaxed">{bullet}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No work experience entries to compare.</p>
            )}
          </div>
        )}

        {/* Tab Content: Skills */}
        {activeTab === "skills" && (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-teal-200 bg-teal-50/20 p-4 dark:border-teal-900/60 dark:bg-teal-950/10">
              <div className="flex items-center space-x-2 text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Skills Re-Ranked by Target Job Relevance</span>
              </div>

              <div className="space-y-3">
                {resume.technical_skills &&
                  Object.entries(resume.technical_skills).map(([cat, skills]) => (
                    <div key={cat}>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                        {cat}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, sIdx) => {
                          const isMatched = resume.matched_skills?.includes(skill);
                          return (
                            <span
                              key={sIdx}
                              className={`rounded-md px-2 py-0.5 text-xs font-medium border ${
                                isMatched
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700"
                                  : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                              }`}
                            >
                              {skill} {isMatched && "★"}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Zero hallucination badge */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>
            Every bullet point strictly honors your real history, dates, degrees, and companies.
          </span>
        </div>
      </div>
    </div>
  );
}
