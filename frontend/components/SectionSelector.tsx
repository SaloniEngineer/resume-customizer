"use client";

import React from "react";
import { Sliders, Mail, CheckSquare, Square } from "lucide-react";

interface SectionSelectorProps {
  selectedSections: string[];
  onChangeSections: (sections: string[]) => void;
  generateCoverLetter: boolean;
  onToggleCoverLetter: (val: boolean) => void;
  disabled?: boolean;
}

const AVAILABLE_SECTIONS = [
  { id: "Summary", label: "Professional Summary", description: "Targeted executive summary for role" },
  { id: "Skills", label: "Technical Skills", description: "Reordered & prioritized keywords" },
  { id: "Experience", label: "Work Experience", description: "Impact-oriented action bullet points" },
  { id: "Projects", label: "Key Projects", description: "Tech stack & metrics alignment" },
];

export default function SectionSelector({
  selectedSections,
  onChangeSections,
  generateCoverLetter,
  onToggleCoverLetter,
  disabled = false,
}: SectionSelectorProps) {
  const toggleSection = (id: string) => {
    if (disabled) return;
    if (selectedSections.includes(id)) {
      if (selectedSections.length > 1) {
        onChangeSections(selectedSections.filter((s) => s !== id));
      }
    } else {
      onChangeSections([...selectedSections, id]);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              3. Customization Scope (Optional)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select which sections you want the AI to customize
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mt-2">
        {AVAILABLE_SECTIONS.map((sec) => {
          const isSelected = selectedSections.includes(sec.id);
          return (
            <div
              key={sec.id}
              onClick={() => toggleSection(sec.id)}
              className={`flex items-start space-x-2.5 p-3 rounded-xl border transition cursor-pointer select-none ${
                isSelected
                  ? "border-teal-500/80 bg-teal-50/40 dark:border-teal-600/80 dark:bg-teal-950/20"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-950/30 dark:hover:bg-slate-900"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="mt-0.5 text-teal-600 dark:text-teal-400">
                {isSelected ? (
                  <CheckSquare className="h-4 w-4 fill-teal-100 dark:fill-teal-950" />
                ) : (
                  <Square className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  {sec.label}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                  {sec.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bonus Feature: Cover Letter generation toggle */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Mail className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Generate Matching Cover Letter (Bonus)
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              Creates a tailored 3-paragraph letter using only verified resume details
            </span>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={generateCoverLetter}
            onChange={(e) => onToggleCoverLetter(e.target.checked)}
            disabled={disabled}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:bg-slate-700 peer-checked:bg-teal-600"></div>
        </label>
      </div>
    </div>
  );
}
