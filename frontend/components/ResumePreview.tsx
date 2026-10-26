"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  Code2,
  FolderGit2,
  GraduationCap,
  Award,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { CustomizedResume } from "@/lib/api";
import DownloadButtons from "./DownloadButtons";

interface ResumePreviewProps {
  resume: CustomizedResume;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copySection = (title: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSection(title);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const contact = resume.contact_info || {};

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
            Generated Result
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ATS-Tailored Resume Preview
          </h3>
        </div>

        <DownloadButtons resume={resume} />
      </div>

      {/* Main Resume Paper Card */}
      <div
        id="resume-printable-area"
        className="rounded-2xl border border-slate-200/90 bg-white p-8 sm:p-12 shadow-md dark:border-slate-800 dark:bg-slate-900 transition"
      >
        {/* Candidate Header */}
        <header className="border-b border-slate-200 pb-6 text-center dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {resume.full_name}
          </h1>

          {/* Contact Bar */}
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
            {contact.email && (
              <span className="flex items-center space-x-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{contact.email}</span>
              </span>
            )}
            {contact.phone && (
              <span className="flex items-center space-x-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{contact.phone}</span>
              </span>
            )}
            {contact.location && (
              <span className="flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{contact.location}</span>
              </span>
            )}
            {contact.linkedin && (
              <span className="flex items-center space-x-1">
                <Linkedin className="h-3.5 w-3.5 text-slate-400" />
                <span>{contact.linkedin}</span>
              </span>
            )}
            {contact.github && (
              <span className="flex items-center space-x-1">
                <Github className="h-3.5 w-3.5 text-slate-400" />
                <span>{contact.github}</span>
              </span>
            )}
            {contact.website && (
              <span className="flex items-center space-x-1">
                <Globe className="h-3.5 w-3.5 text-slate-400" />
                <span>{contact.website}</span>
              </span>
            )}
          </div>
        </header>

        {/* Section: Professional Summary */}
        {resume.professional_summary && (
          <section className="mt-6">
            <div className="flex items-center justify-between pb-1.5 border-b border-teal-600/30 dark:border-teal-400/30">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Professional Summary
              </h2>
              <button
                type="button"
                onClick={() => copySection("summary", resume.professional_summary)}
                title="Copy Summary"
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center space-x-1 transition"
              >
                {copiedSection === "summary" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>{copiedSection === "summary" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
              {resume.professional_summary}
            </p>
          </section>
        )}

        {/* Section: Technical Skills */}
        {resume.technical_skills && Object.keys(resume.technical_skills).length > 0 && (
          <section className="mt-6">
            <div className="pb-1.5 border-b border-teal-600/30 dark:border-teal-400/30">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Technical Skills & Core Competencies
              </h2>
            </div>
            <div className="mt-2.5 space-y-2">
              {Object.entries(resume.technical_skills).map(([category, skills]) => {
                if (!skills || skills.length === 0) return null;
                return (
                  <div key={category} className="text-xs sm:text-sm">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {category}:{" "}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {skills.join(", ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section: Work Experience */}
        {resume.work_experience && resume.work_experience.length > 0 && (
          <section className="mt-6">
            <div className="pb-1.5 border-b border-teal-600/30 dark:border-teal-400/30">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Work Experience
              </h2>
            </div>

            <div className="mt-3 space-y-4">
              {resume.work_experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {exp.role}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {" "}
                        — {exp.company}
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 italic mt-0.5 sm:mt-0">
                      {[exp.location, exp.duration].filter(Boolean).join(" | ")}
                    </div>
                  </div>

                  <ul className="mt-1 list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <section className="mt-6">
            <div className="pb-1.5 border-b border-teal-600/30 dark:border-teal-400/30">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Key Projects
              </h2>
            </div>

            <div className="mt-3 space-y-3.5">
              {resume.projects.map((proj, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {proj.name}
                      </span>
                      {proj.role_or_tech && (
                        <span className="text-slate-500 text-xs italic">
                          ({proj.role_or_tech})
                        </span>
                      )}
                    </div>
                    {proj.link && (
                      <a
                        href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 inline-flex items-center space-x-1"
                      >
                        <span>Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {proj.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {proj.description}
                    </p>
                  )}

                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {proj.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Education */}
        {resume.education && resume.education.length > 0 && (
          <section className="mt-6">
            <div className="pb-1.5 border-b border-teal-600/30 dark:border-teal-400/30">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Education
              </h2>
            </div>

            <div className="mt-2.5 space-y-2">
              {resume.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm"
                >
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {edu.degree}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {" "}
                      — {edu.institution}
                    </span>
                    {edu.gpa_or_honors && (
                      <span className="text-slate-500 italic ml-2">
                        [{edu.gpa_or_honors}]
                      </span>
                    )}
                  </div>
                  {edu.graduation_year && (
                    <span className="text-[11px] sm:text-xs text-slate-500 italic">
                      {edu.graduation_year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <section className="mt-6">
            <div className="pb-1.5 border-b border-teal-600/30 dark:border-teal-400/30">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Certifications & Credentials
              </h2>
            </div>

            <div className="mt-2.5 space-y-1.5">
              {resume.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                >
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      • {cert.name}
                    </span>
                    {cert.issuer && (
                      <span className="text-slate-500"> ({cert.issuer})</span>
                    )}
                  </div>
                  {cert.year && (
                    <span className="text-[11px] text-slate-400 italic">
                      {cert.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
