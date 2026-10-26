import json
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Response
from fastapi.responses import Response

from app.schemas.resume import (
    CustomizedResume,
    CoverLetterRequest,
    CoverLetterResponse,
)
from app.services.resume_parser import ResumeParserService
from app.services.llm_service import llm_service
from app.services.resume_generator import ResumeGeneratorService

router = APIRouter(tags=["Resume"])

MIN_JD_LENGTH = 50

@router.post("/customize-resume", response_model=CustomizedResume)
async def customize_resume(
    file: UploadFile = File(..., description="Resume file in PDF or DOCX format (Max 5MB)"),
    job_description: str = Form(default="", description="Full text of the target job description"),
    target_sections: Optional[str] = Form(None, description="Optional JSON array or comma-separated sections to customize"),
    generate_cover_letter: bool = Form(False, description="Optionally generate a tailored cover letter as well")
):
    """
    Main endpoint:
    1. Validates Job Description & uploaded document.
    2. Extracts clean text from PDF (PyMuPDF) or DOCX (python-docx).
    3. Analyzes JD & Resume with Groq LLM API.
    4. Returns structured JSON containing tailored resume, matched skills, suggestions, and match scores.
    """
    # 1. Validate Job Description
    clean_jd = (job_description or "").strip()
    if not clean_jd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description cannot be empty. Please paste the job description text."
        )
    
    if len(clean_jd) < MIN_JD_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Job description is too short ({len(clean_jd)} characters). Please provide a complete job description with at least {MIN_JD_LENGTH} characters."
        )

    # 2. Parse uploaded Resume
    resume_text, metadata = await ResumeParserService.parse_resume(file)
    
    # Parse target sections if provided
    parsed_sections: Optional[List[str]] = None
    if target_sections:
        try:
            parsed_sections = json.loads(target_sections)
            if not isinstance(parsed_sections, list):
                parsed_sections = [s.strip() for s in target_sections.split(",") if s.strip()]
        except Exception:
            parsed_sections = [s.strip() for s in target_sections.split(",") if s.strip()]

    # 3. Customize with LLM
    customized_resume = await llm_service.customize_resume(
        resume_text=resume_text,
        job_description=clean_jd,
        target_sections=parsed_sections,
        generate_cover_letter=generate_cover_letter
    )

    return customized_resume

@router.post("/generate-cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(request: CoverLetterRequest):
    """
    Generates a tailored cover letter based on the customized resume and job description.
    """
    if not request.job_description or len(request.job_description.strip()) < MIN_JD_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Valid job description with at least {MIN_JD_LENGTH} characters is required."
        )
    
    letter_text = await llm_service.generate_cover_letter(
        resume_data=request.resume_data,
        job_description=request.job_description,
        company_name=request.company_name,
        role_title=request.role_title
    )
    
    return CoverLetterResponse(
        cover_letter=letter_text,
        company_name=request.company_name,
        role_title=request.role_title
    )

@router.post("/download/txt")
async def download_txt(resume: CustomizedResume):
    """
    Returns the customized resume formatted as plain text (.txt).
    """
    txt_content = ResumeGeneratorService.generate_txt(resume)
    filename = f"{resume.full_name.replace(' ', '_').lower()}_resume.txt"
    return Response(
        content=txt_content.encode("utf-8"),
        media_type="text/plain; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.post("/download/pdf")
async def download_pdf(resume: CustomizedResume):
    """
    Returns the customized resume as a professionally styled PDF document (.pdf).
    """
    pdf_bytes = ResumeGeneratorService.generate_pdf(resume)
    filename = f"{resume.full_name.replace(' ', '_').lower()}_resume.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.post("/download/docx")
async def download_docx(resume: CustomizedResume):
    """
    Returns the customized resume as a formatted Word document (.docx).
    """
    docx_bytes = ResumeGeneratorService.generate_docx(resume)
    filename = f"{resume.full_name.replace(' ', '_').lower()}_resume.docx"
    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
