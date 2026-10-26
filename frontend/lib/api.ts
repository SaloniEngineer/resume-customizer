export interface WorkExperienceItem {
  company: string;
  role: string;
  duration?: string | null;
  location?: string | null;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  role_or_tech?: string | null;
  description?: string | null;
  bullets: string[];
  link?: string | null;
}

export interface EducationItem {
  institution: string;
  degree: string;
  graduation_year?: string | null;
  gpa_or_honors?: string | null;
}

export interface CertificationItem {
  name: string;
  issuer?: string | null;
  year?: string | null;
}

export interface MatchScoreBreakdown {
  keyword_overlap: number;
  skills_alignment: number;
  experience_relevance: number;
}

export interface CustomizedResume {
  full_name: string;
  contact_info: Record<string, string | null>;
  professional_summary: string;
  technical_skills: Record<string, string[]>;
  work_experience: WorkExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  matched_skills: string[];
  missing_keywords: string[];
  suggested_keywords: string[];
  improvement_suggestions: string[];
  match_score: number;
  match_score_breakdown: MatchScoreBreakdown;
  ats_compatibility_score: number;
  cover_letter?: string | null;
  original_text?: string | null;
  original_text_summary?: string | null;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  llm_configured: boolean;
  llm_model: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function checkBackendHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("Backend health check failed:", err);
    return null;
  }
}

export async function customizeResume(
  file: File,
  jobDescription: string,
  sections?: string[],
  generateCoverLetter: boolean = false
): Promise<CustomizedResume> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);
  if (sections && sections.length > 0) {
    formData.append("target_sections", JSON.stringify(sections));
  }
  formData.append("generate_cover_letter", String(generateCoverLetter));

  const response = await fetch(`${API_BASE_URL}/api/customize-resume`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Failed to customize resume. Please check your inputs.";
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = typeof errorData.detail === "string" 
          ? errorData.detail 
          : JSON.stringify(errorData.detail);
      }
    } catch {
      errorMessage = `Server returned status ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

export async function generateCoverLetter(
  resumeData: CustomizedResume,
  jobDescription: string,
  companyName?: string,
  roleTitle?: string
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/generate-cover-letter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resume_data: resumeData,
      job_description: jobDescription,
      company_name: companyName,
      role_title: roleTitle,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Failed to generate cover letter" }));
    throw new Error(err.detail || "Failed to generate cover letter");
  }

  const data = await response.json();
  return data.cover_letter;
}

export async function downloadResumeFile(
  resume: CustomizedResume,
  format: "pdf" | "txt" | "docx"
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/download/${format}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resume),
  });

  if (!response.ok) {
    throw new Error(`Failed to download ${format.toUpperCase()} file`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  const safeName = resume.full_name ? resume.full_name.toLowerCase().replace(/\s+/g, "_") : "customized";
  a.download = `${safeName}_resume.${format}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
