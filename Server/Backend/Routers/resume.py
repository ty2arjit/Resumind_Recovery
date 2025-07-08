from fastapi import APIRouter, UploadFile, File, Form
from utils.pdf_parser import extract_text_from_pdf
from fastapi_app.Internship.gemini_resume_CS import resume_analysis_CSE_Intern


router = APIRouter()

@router.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_type: str = Form(...),
    job_domain: str = Form(...)
):
    file_bytes = await file.read()
    resume_text = extract_text_from_pdf(file_bytes)
    result = resume_analysis_CSE_Intern(resume_text, job_type, job_domain)
    return {"analysis": result}
