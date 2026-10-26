"use client";

import React from "react";
import { Briefcase, Sparkles, XCircle, AlertCircle } from "lucide-react";

interface JobDescriptionFormProps {
  value: string;
  onChange: (val: string) => void;
  error?: string | null;
  disabled?: boolean;
}

const SAMPLE_JD = `Role: Senior Full Stack Engineer (Python & React)
Location: Remote / Hybrid

About the Role:
We are looking for an experienced Full Stack Engineer to build and scale next-generation cloud applications. You will collaborate closely with product and data teams to deliver high-performance, ATS-ready, and resilient web solutions.

Key Responsibilities:
• Architect, build, and optimize performant RESTful APIs using Python, FastAPI, and PostgreSQL.
• Design responsive, accessible user interfaces using Next.js, React, TypeScript, and modern CSS/Tailwind.
• Implement scalable cloud infrastructure, containerized deployments with Docker, and automated CI/CD pipelines.
• Collaborate on system design, microservices architecture, and API security.
• Optimize application latency, database queries, and caching strategies using Redis.

Qualifications & Skills:
• 3+ years of professional full-stack development experience.
• Strong proficiency in Python, FastAPI or Django, and asynchronous programming.
• Extensive experience with modern frontend frameworks (React, Next.js, TypeScript).
• Familiarity with Docker, Kubernetes, AWS or GCP, and CI/CD automation.
• Solid background in database design, performance tuning, and automated testing (pytest, Jest).
• Strong communication skills and a passion for engineering excellence.`;

export default function JobDescriptionForm({
  value,
  onChange,
  error,
  disabled = false,
}: JobDescriptionFormProps) {
  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const isTooShort = charCount > 0 && charCount < 50;

  const handleInsertSample = () => {
    onChange(SAMPLE_JD);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              1. Job Description
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste the role requirements you are applying for
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center space-x-1 transition disabled:opacity-50"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleInsertSample}
            disabled={disabled}
            className="inline-flex items-center space-x-1.5 rounded-lg border border-teal-200 bg-teal-50/80 px-2.5 py-1 text-xs font-medium text-teal-800 transition hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-950/50 dark:text-teal-300 dark:hover:bg-teal-900/60 disabled:opacity-50"
          >
            <Sparkles className="h-3 w-3" />
            <span>Sample JD</span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 mt-2">
        <textarea
          id="job-description-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste the target job description here (responsibilities, required qualifications, technical skills)..."
          rows={11}
          className={`w-full h-full min-h-[220px] resize-none rounded-xl border p-3.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:text-slate-100 dark:placeholder:text-slate-500 transition ${
            error || isTooShort
              ? "border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-900 dark:bg-rose-950/10"
              : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-teal-500/20 dark:border-slate-800 dark:bg-slate-950/40"
          }`}
        />
      </div>

      {/* Validation and counters footer */}
      <div className="mt-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5">
          {error ? (
            <span className="flex items-center space-x-1 font-medium text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{error}</span>
            </span>
          ) : isTooShort ? (
            <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Minimum 50 characters required ({charCount}/50)</span>
            </span>
          ) : (
            <span className="text-slate-400">Paste full job posting for best ATS matching</span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-slate-400 tabular-nums">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>
      </div>
    </div>
  );
}
