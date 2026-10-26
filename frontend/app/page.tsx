"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  FileCheck2,
  FileText,
  Target,
  GitCompare,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";
import JobDescriptionForm from "@/components/JobDescriptionForm";
import ResumeUploader from "@/components/ResumeUploader";
import SectionSelector from "@/components/SectionSelector";
import LoadingState from "@/components/LoadingState";
import ResumePreview from "@/components/ResumePreview";
import MatchScoreCard from "@/components/MatchScoreCard";
import DiffView from "@/components/DiffView";
import CoverLetterModal from "@/components/CoverLetterModal";
import {
  CustomizedResume,
  HealthResponse,
  checkBackendHealth,
  customizeResume,
} from "@/lib/api";

type ActiveTab = "preview" | "score" | "diff" | "cover_letter";

export default function Home() {
  // Input states
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "Summary",
    "Skills",
    "Experience",
    "Projects",
  ]);
  const [generateCoverLetter, setGenerateCoverLetter] = useState(false);

  // App lifecycle states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customizedResume, setCustomizedResume] = useState<CustomizedResume | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("preview");
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);

  // Health check state
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Form validation errors
  const [jdError, setJdError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setCheckingHealth(true);
    const h = await checkBackendHealth();
    setHealth(h);
    setCheckingHealth(false);
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  // Validation
  const validateForm = (): boolean => {
    let isValid = true;
    setJdError(null);
    setFileError(null);
    setErrorMessage(null);

    const trimmedJd = jobDescription.trim();
    if (!trimmedJd) {
      setJdError("Please enter or paste a job description.");
      isValid = false;
    } else if (trimmedJd.length < 50) {
      setJdError(`Job description is too short (${trimmedJd.length}/50 chars).`);
      isValid = false;
    }

    if (!resumeFile) {
      setFileError("Please upload your resume in PDF or DOCX format.");
      isValid = false;
    }

    return isValid;
  };

  const handleCustomize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !resumeFile) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const result = await customizeResume(
        resumeFile,
        jobDescription,
        selectedSections,
        generateCoverLetter
      );

      setCustomizedResume(result);
      setActiveTab("preview");

      // Scroll to results
      setTimeout(() => {
        window.scrollTo({ top: 380, behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      console.error("Customization failed:", err);
      setErrorMessage(err.message || "An error occurred while tailoring your resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCustomizedResume(null);
    setJobDescription("");
    setResumeFile(null);
    setErrorMessage(null);
    setJdError(null);
    setFileError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isSubmitDisabled =
    isLoading || !jobDescription.trim() || jobDescription.trim().length < 50 || !resumeFile;

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        health={health}
        checkingHealth={checkingHealth}
        onRefreshHealth={fetchHealth}
      />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-teal-50/60 via-white to-transparent pt-10 pb-8 dark:from-slate-900/60 dark:via-slate-950 dark:to-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 rounded-full border border-teal-200/80 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-800 dark:border-teal-900/80 dark:bg-teal-950/60 dark:text-teal-300 mb-4 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Zero-Hallucination AI Resume Customization</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto">
              Tailor Your Resume to Any Role with{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Precision AI
              </span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Boost your ATS match rate, strengthen impact-driven bullets, and download formatted PDF or Word resumes — while preserving 100% of your real background.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
          {/* Main Error Banner */}
          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs sm:text-sm font-medium text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200 flex items-start space-x-3 shadow-sm animate-fade-in">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Customization Error</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Form Inputs Container */}
          <form onSubmit={handleCustomize} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left Column: Job Description */}
              <JobDescriptionForm
                value={jobDescription}
                onChange={setJobDescription}
                error={jdError}
                disabled={isLoading}
              />

              {/* Right Column: Resume Uploader */}
              <ResumeUploader
                file={resumeFile}
                onFileSelect={setResumeFile}
                error={fileError}
                disabled={isLoading}
              />
            </div>

            {/* Section Selection and Bonus Options */}
            <SectionSelector
              selectedSections={selectedSections}
              onChangeSections={setSelectedSections}
              generateCoverLetter={generateCoverLetter}
              onToggleCoverLetter={setGenerateCoverLetter}
              disabled={isLoading}
            />

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Strict zero-hallucination constraint enforced</span>
              </div>

              <div className="flex items-center space-x-3">
                {customizedResume && (
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset All</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition hover:from-teal-700 hover:to-emerald-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isLoading ? "Tailoring Resume..." : "Tailor Resume Now"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Loading State Animation */}
          {isLoading && <LoadingState />}

          {/* Results Section */}
          {customizedResume && !isLoading && (
            <div className="mt-10 space-y-6 animate-slide-up">
              {/* Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeTab === "preview"
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Tailored Resume</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("score")}
                    className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeTab === "score"
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Target className="h-4 w-4" />
                    <span>Match & ATS Score ({customizedResume.match_score}%)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("diff")}
                    className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeTab === "diff"
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    <GitCompare className="h-4 w-4" />
                    <span>Diff & Improvements</span>
                  </button>

                  {customizedResume.cover_letter && (
                    <button
                      onClick={() => setIsCoverLetterModalOpen(true)}
                      className="inline-flex items-center space-x-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300"
                    >
                      <Mail className="h-4 w-4" />
                      <span>View Cover Letter</span>
                    </button>
                  )}
                </div>

                <div className="hidden sm:flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Customization Complete</span>
                </div>
              </div>

              {/* Tab Panels */}
              {activeTab === "preview" && <ResumePreview resume={customizedResume} />}
              {activeTab === "score" && <MatchScoreCard resume={customizedResume} />}
              {activeTab === "diff" && <DiffView resume={customizedResume} />}

              {/* Cover Letter Modal */}
              <CoverLetterModal
                resume={customizedResume}
                jobDescription={jobDescription}
                isOpen={isCoverLetterModalOpen}
                onClose={() => setIsCoverLetterModalOpen(false)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 dark:border-slate-800 dark:bg-slate-900 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TailorCraft © 2026 • AI-Powered Executive Resume Optimization</span>
          <div className="flex items-center space-x-4">
            <span>Powered by Groq LLM & FastAPI</span>
            <span>•</span>
            <span>PyMuPDF & python-docx Parsing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
