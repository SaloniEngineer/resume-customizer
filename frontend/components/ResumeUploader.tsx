"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2, FileType } from "lucide-react";

interface ResumeUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string | null;
  disabled?: boolean;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = ["pdf", "docx"];

export default function ResumeUploader({
  file,
  onFileSelect,
  error,
  disabled = false,
}: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateAndSet = (selectedFile: File) => {
    setLocalError(null);
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();

    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      setLocalError("Invalid file type. Please upload a PDF (.pdf) or Word document (.docx).");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setLocalError("File size exceeds 5 MB limit. Please upload a smaller file.");
      return;
    }

    if (selectedFile.size === 0) {
      setLocalError("Selected file is empty (0 bytes).");
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSet(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSet(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Helper to generate a demo PDF or demo DOCX on the fly for effortless testing
  const handleLoadDemoResume = (type: "pdf" | "docx") => {
    const demoContent = `Jane Doe
Senior Full-Stack Engineer
San Francisco, CA | jane.doe@example.com | (555) 234-5678 | linkedin.com/in/janedoe

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Engineer with 5+ years of experience architecting resilient web applications, designing RESTful APIs with Python and FastAPI, and building high-performance UIs in React and TypeScript. Proven expertise in microservices, Docker containerization, and reducing system latency.

TECHNICAL SKILLS
• Languages: Python, TypeScript, JavaScript, SQL, Bash
• Frameworks: FastAPI, React, Next.js, Django, Node.js, Tailwind CSS
• Tools & Cloud: Docker, PostgreSQL, Redis, Git, AWS (S3, ECS), CI/CD (GitHub Actions)

WORK EXPERIENCE
Senior Full-Stack Developer | CloudTech Solutions (2022 - Present)
• Architected scalable microservices using Python and FastAPI, cutting endpoint latency by 35% across 20+ services.
• Engineered responsive user portals in Next.js and React, increasing monthly user retention by 22%.
• Containerized production workloads with Docker and orchestrated automated CI/CD testing pipelines.

Software Engineer | NexaCorp (2019 - 2022)
• Built RESTful endpoints and integrated PostgreSQL with SQLAlchemy for an enterprise CRM platform.
• Optimized complex database queries and indexing strategies, decreasing query times by 40%.
• Collaborated in an Agile Scrum environment with bi-weekly sprint delivery.

PROJECTS
Real-Time Distributed Pipeline (Python, FastAPI, Redis)
• Engineered a distributed task queue handling 5,000 requests/sec with sub-50ms latency.
• Implemented automated health checks and structured logging.

EDUCATION
B.S. in Computer Science | University of California, Berkeley (2019)`;

    // Create a client file representation
    const blob = new Blob([demoContent], { type: type === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const demoFile = new File([blob], `Jane_Doe_Resume.${type}`, {
      type: type === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      lastModified: Date.now(),
    });

    onFileSelect(demoFile);
    setLocalError(null);
  };

  const activeError = error || localError;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              2. Upload Resume
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload your current resume (.pdf or .docx)
            </p>
          </div>
        </div>

        {/* Demo resume helper button */}
        {!file && (
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => handleLoadDemoResume("pdf")}
              disabled={disabled}
              className="text-xs text-teal-700 bg-teal-50/70 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200/80 transition dark:text-teal-300 dark:bg-teal-950/40 dark:border-teal-900"
            >
              Demo Resume
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        id="resume-file-input"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />

      {file ? (
        <div className="mt-2 flex flex-1 flex-col justify-center rounded-xl border border-teal-200 bg-teal-50/30 p-5 dark:border-teal-900/60 dark:bg-teal-950/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                <FileType className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[220px] sm:max-w-xs">
                    {file.name}
                  </h3>
                  <span className="rounded-md bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                    {file.name.split(".").pop()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Size: {formatFileSize(file.size)}
                </p>
                <div className="flex items-center space-x-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Ready for AI customization</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              title="Remove file"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-teal-100 dark:border-teal-900/40 flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Want to change file?</span>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="font-medium text-teal-700 hover:text-teal-800 dark:text-teal-300 underline"
            >
              Browse replacement
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`mt-2 flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition cursor-pointer min-h-[220px] ${
            isDragging
              ? "border-teal-500 bg-teal-50/40 dark:border-teal-400 dark:bg-teal-950/20"
              : activeError
              ? "border-rose-300 bg-rose-50/20 hover:border-rose-400 dark:border-rose-900 dark:bg-rose-950/10"
              : "border-slate-300 bg-slate-50/60 hover:border-teal-500/80 hover:bg-teal-50/20 dark:border-slate-700 dark:bg-slate-950/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-teal-400 mb-3">
            <UploadCloud className="h-6 w-6" />
          </div>

          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supports PDF (.pdf) or Word (.docx) documents up to 5 MB
          </p>

          <div className="mt-4 flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="rounded bg-slate-200/70 px-1.5 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              PDF
            </span>
            <span className="rounded bg-slate-200/70 px-1.5 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              DOCX
            </span>
            <span>• Max 5 MB</span>
          </div>
        </div>
      )}

      {/* Error display */}
      <div className="mt-2.5 min-h-[18px]">
        {activeError && (
          <span className="flex items-center space-x-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{activeError}</span>
          </span>
        )}
      </div>
    </div>
  );
}
