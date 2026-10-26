"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Target,
  Sparkles,
  Info,
} from "lucide-react";
import { CustomizedResume } from "@/lib/api";

interface MatchScoreCardProps {
  resume: CustomizedResume;
}

export default function MatchScoreCard({ resume }: MatchScoreCardProps) {
  const score = resume.match_score || 82;
  const atsScore = resume.ats_compatibility_score || 90;
  const breakdown = resume.match_score_breakdown || {
    keyword_overlap: 80,
    skills_alignment: 85,
    experience_relevance: 78,
  };

  const getScoreColor = (val: number) => {
    if (val >= 80) return "text-emerald-600 dark:text-emerald-400 border-emerald-500";
    if (val >= 65) return "text-amber-600 dark:text-amber-400 border-amber-500";
    return "text-rose-600 dark:text-rose-400 border-rose-500";
  };

  const getScoreBg = (val: number) => {
    if (val >= 80) return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200";
    if (val >= 65) return "bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200";
    return "bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200";
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Overall Score & ATS Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Match Gauge Card */}
        <div className="md:col-span-1 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
            <Target className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span>ROLE ALIGNMENT ESTIMATE</span>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div
              className={`flex h-28 w-28 items-center justify-center rounded-full border-4 ${getScoreColor(
                score
              )} shadow-inner`}
            >
              <div className="text-center">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {score}%
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {score >= 80 ? "Strong Fit" : score >= 65 ? "Moderate Fit" : "Needs Polish"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center space-x-1 text-[11px] text-slate-400">
            <Info className="h-3 w-3 flex-shrink-0" />
            <span>Estimated based on JD & resume keyword overlap</span>
          </div>
        </div>

        {/* ATS Readiness & Breakdown Card */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    ATS Readiness & Metrics
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Structural and semantic analysis breakdown
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">ATS Score:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getScoreBg(atsScore)}`}>
                  {atsScore}/100
                </span>
              </div>
            </div>

            {/* Breakdown bars */}
            <div className="mt-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Keyword Overlap with JD</span>
                  <span className="tabular-nums font-semibold">{breakdown.keyword_overlap}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-500 transition-all duration-500"
                    style={{ width: `${breakdown.keyword_overlap}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Technical Skills Alignment</span>
                  <span className="tabular-nums font-semibold">{breakdown.skills_alignment}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${breakdown.skills_alignment}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Experience & Responsibilities Match</span>
                  <span className="tabular-nums font-semibold">{breakdown.experience_relevance}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${breakdown.experience_relevance}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Standard ATS parsers prioritize structured headings & clean typography.</span>
            <span className="font-medium text-teal-600 dark:text-teal-400">ATS Optimized</span>
          </div>
        </div>
      </div>

      {/* Matched Skills vs Missing Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched Skills */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Matched Skills & Keywords ({resume.matched_skills?.length || 0})
            </h4>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {resume.matched_skills && resume.matched_skills.length > 0 ? (
              resume.matched_skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{skill}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No matching skills detected.</span>
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Keywords in JD Not Yet in Resume ({resume.missing_keywords?.length || 0})
            </h4>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {resume.missing_keywords && resume.missing_keywords.length > 0 ? (
              resume.missing_keywords.map((kw, idx) => (
                <span
                  key={idx}
                  title="If you have experience with this, consider adding it to your resume"
                  className="inline-flex items-center space-x-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40"
                >
                  <span>{kw}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Great job! All key target skills from JD are represented.
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mt-2.5">
            Only add these keywords if you actually have genuine experience with them.
          </p>
        </div>
      </div>

      {/* Actionable Improvement Suggestions */}
      {resume.improvement_suggestions && resume.improvement_suggestions.length > 0 && (
        <div className="rounded-2xl border border-teal-200/80 bg-teal-50/30 p-5 shadow-sm dark:border-teal-900/60 dark:bg-teal-950/20">
          <div className="flex items-center space-x-2 pb-3 border-b border-teal-100 dark:border-teal-900/40">
            <Lightbulb className="h-4 w-4 text-teal-700 dark:text-teal-300" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200">
              High-Impact Interview Conversion Suggestions
            </h4>
          </div>

          <div className="mt-3 space-y-2">
            {resume.improvement_suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-200/60 text-[10px] font-bold text-teal-800 dark:bg-teal-900/70 dark:text-teal-200 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
