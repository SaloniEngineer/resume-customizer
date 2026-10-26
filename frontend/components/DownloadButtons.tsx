"use client";

import React, { useState } from "react";
import { Download, FileText, Check, Copy, FileType } from "lucide-react";
import { CustomizedResume, downloadResumeFile } from "@/lib/api";

interface DownloadButtonsProps {
  resume: CustomizedResume;
}

export default function DownloadButtons({ resume }: DownloadButtonsProps) {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDownload = async (format: "pdf" | "txt" | "docx") => {
    try {
      setDownloadingFormat(format);
      await downloadResumeFile(resume, format);
    } catch (err) {
      console.error(`Failed to download ${format}:`, err);
      alert(`Could not download ${format.toUpperCase()} file. Please check backend connection.`);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleCopy = async () => {
    try {
      const parts: string[] = [];
      parts.push(resume.full_name.toUpperCase());
      
      const contacts = Object.values(resume.contact_info || {}).filter(Boolean);
      if (contacts.length) parts.push(contacts.join(" | "));
      parts.push("\nPROFESSIONAL SUMMARY\n" + resume.professional_summary);

      if (resume.technical_skills) {
        parts.push("\nTECHNICAL SKILLS");
        for (const [cat, skills] of Object.entries(resume.technical_skills)) {
          if (skills?.length) parts.push(`• ${cat}: ${skills.join(", ")}`);
        }
      }

      if (resume.work_experience?.length) {
        parts.push("\nWORK EXPERIENCE");
        for (const exp of resume.work_experience) {
          parts.push(`\n${exp.role} | ${exp.company} (${exp.duration || ""})`);
          for (const b of exp.bullets) parts.push(`  • ${b}`);
        }
      }

      if (resume.projects?.length) {
        parts.push("\nPROJECTS");
        for (const proj of resume.projects) {
          parts.push(`\n${proj.name} | ${proj.role_or_tech || ""}`);
          if (proj.description) parts.push(`  ${proj.description}`);
          for (const b of proj.bullets) parts.push(`  • ${b}`);
        }
      }

      if (resume.education?.length) {
        parts.push("\nEDUCATION");
        for (const edu of resume.education) {
          parts.push(`• ${edu.degree} - ${edu.institution} (${edu.graduation_year || ""})`);
        }
      }

      if (resume.certifications?.length) {
        parts.push("\nCERTIFICATIONS");
        for (const cert of resume.certifications) {
          parts.push(`• ${cert.name} - ${cert.issuer || ""} (${cert.year || ""})`);
        }
      }

      await navigator.clipboard.writeText(parts.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Copy Button */}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-700 dark:text-emerald-300">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 text-slate-500" />
            <span>Copy Text</span>
          </>
        )}
      </button>

      {/* Download TXT */}
      <button
        type="button"
        onClick={() => handleDownload("txt")}
        disabled={downloadingFormat !== null}
        className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 disabled:opacity-50"
      >
        <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        <span>{downloadingFormat === "txt" ? "Generating..." : "Download TXT"}</span>
      </button>

      {/* Download DOCX */}
      <button
        type="button"
        onClick={() => handleDownload("docx")}
        disabled={downloadingFormat !== null}
        className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 disabled:opacity-50"
      >
        <FileType className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span>{downloadingFormat === "docx" ? "Generating..." : "Download DOCX"}</span>
      </button>

      {/* Download PDF (Primary Highlight) */}
      <button
        type="button"
        onClick={() => handleDownload("pdf")}
        disabled={downloadingFormat !== null}
        className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-teal-500/20 transition hover:from-teal-700 hover:to-emerald-700 active:scale-95 disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        <span>{downloadingFormat === "pdf" ? "Rendering PDF..." : "Download PDF"}</span>
      </button>
    </div>
  );
}
