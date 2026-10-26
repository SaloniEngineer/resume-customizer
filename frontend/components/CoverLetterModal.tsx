"use client";

import React, { useState } from "react";
import { Mail, Copy, Check, Download, RefreshCw, Send, X } from "lucide-react";
import { CustomizedResume, generateCoverLetter } from "@/lib/api";

interface CoverLetterModalProps {
  resume: CustomizedResume;
  jobDescription: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CoverLetterModal({
  resume,
  jobDescription,
  isOpen,
  onClose,
}: CoverLetterModalProps) {
  const [coverLetterText, setCoverLetterText] = useState<string>(
    resume.cover_letter || ""
  );
  const [companyName, setCompanyName] = useState<string>("");
  const [roleTitle, setRoleTitle] = useState<string>("");
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetterText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.full_name.replace(/\s+/g, "_").toLowerCase()}_cover_letter.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      const text = await generateCoverLetter(
        resume,
        jobDescription,
        companyName || undefined,
        roleTitle || undefined
      );
      setCoverLetterText(text);
    } catch (err: any) {
      alert(`Could not regenerate cover letter: ${err.message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tailored Cover Letter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generated from your verified background and the target role
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Inputs for regeneration */}
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 dark:bg-slate-950/40 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Company name (optional)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <input
            type="text"
            placeholder="Role title (optional)"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="inline-flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
            <span>{isRegenerating ? "Regenerating..." : "Regenerate"}</span>
          </button>
        </div>

        {/* Letter Text Area */}
        <div className="p-6 overflow-y-auto flex-1">
          <textarea
            value={coverLetterText}
            onChange={(e) => setCoverLetterText(e.target.value)}
            rows={14}
            className="w-full h-full min-h-[300px] resize-none rounded-xl border border-slate-200 bg-white p-4 font-sans text-sm leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200"
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <span className="text-[11px] text-slate-400">
            Edit text directly before copying or downloading.
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              <Download className="h-4 w-4" />
              <span>Download .txt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
