from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

class WorkExperienceItem(BaseModel):
    company: str = Field(..., description="Company or organization name")
    role: str = Field(..., description="Job title / role")
    duration: Optional[str] = Field(None, description="Employment dates, e.g. Jun 2021 - Present")
    location: Optional[str] = Field(None, description="Location, e.g. San Francisco, CA or Remote")
    bullets: List[str] = Field(default_factory=list, description="Action-oriented achievement bullet points tailored to the JD")

class ProjectItem(BaseModel):
    name: str = Field(..., description="Project name")
    role_or_tech: Optional[str] = Field(None, description="Technologies used or role")
    description: Optional[str] = Field(None, description="Brief summary of the project")
    bullets: List[str] = Field(default_factory=list, description="Measurable achievements / contributions")
    link: Optional[str] = Field(None, description="Optional GitHub or live URL")

class EducationItem(BaseModel):
    institution: str = Field(..., description="University or institution name")
    degree: str = Field(..., description="Degree or program, e.g. B.S. in Computer Science")
    graduation_year: Optional[str] = Field(None, description="Graduation year or date range")
    gpa_or_honors: Optional[str] = Field(None, description="Honors, awards, or GPA if present in source")

class CertificationItem(BaseModel):
    name: str = Field(..., description="Certification name")
    issuer: Optional[str] = Field(None, description="Issuing body, e.g. AWS, Microsoft")
    year: Optional[str] = Field(None, description="Year earned or credential ID")

class MatchScoreBreakdown(BaseModel):
    keyword_overlap: int = Field(default=80, description="Percentage of JD keywords matched in resume")
    skills_alignment: int = Field(default=85, description="Percentage of technical skills aligning with role")
    experience_relevance: int = Field(default=75, description="Relevance of work history to required responsibilities")

class CustomizedResume(BaseModel):
    full_name: str = Field(default="Candidate", description="Full name of candidate")
    contact_info: Dict[str, Optional[str]] = Field(
        default_factory=dict,
        description="Contact items like email, phone, linkedin, github, location, website"
    )
    professional_summary: str = Field(
        ...,
        description="Compelling, JD-tailored professional summary highlighting relevant impact"
    )
    technical_skills: Dict[str, List[str]] = Field(
        default_factory=dict,
        description="Skills categorized into Languages, Frameworks, Tools, Cloud, etc."
    )
    work_experience: List[WorkExperienceItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    education: List[EducationItem] = Field(default_factory=list)
    certifications: List[CertificationItem] = Field(default_factory=list)
    
    # Analysis & Insights
    suggested_keywords: List[str] = Field(
        default_factory=list,
        description="Keywords recommended to emphasize or include based on JD"
    )
    matched_skills: List[str] = Field(
        default_factory=list,
        description="Candidate skills that directly match the JD requirements"
    )
    missing_keywords: List[str] = Field(
        default_factory=list,
        description="Relevant keywords present in the JD but not found in candidate's original resume"
    )
    improvement_suggestions: List[str] = Field(
        default_factory=list,
        description="Actionable advice for the candidate to maximize interview conversion"
    )
    
    # Bonus metrics
    match_score: int = Field(default=82, description="Estimated match percentage (0-100)")
    match_score_breakdown: MatchScoreBreakdown = Field(default_factory=MatchScoreBreakdown)
    ats_compatibility_score: int = Field(default=90, description="ATS readiness estimate (0-100)")
    
    # Optional generated cover letter
    cover_letter: Optional[str] = Field(None, description="Tailored cover letter if requested")
    
    # Metadata for diff comparison
    original_text_summary: Optional[str] = Field(None, description="Original parsed summary for diff comparison")
    original_text: Optional[str] = Field(None, description="Original parsed resume text")

class CoverLetterRequest(BaseModel):
    job_description: str
    resume_data: CustomizedResume
    company_name: Optional[str] = None
    role_title: Optional[str] = None

class CoverLetterResponse(BaseModel):
    cover_letter: str
    company_name: Optional[str] = None
    role_title: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    llm_configured: bool
    llm_model: str
