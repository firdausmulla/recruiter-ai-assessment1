from datetime import datetime
from typing import List, Literal
from pydantic import BaseModel, Field

# Pydantic schema enforced on Gemini structured output
class StructuredAnalysis(BaseModel):
    fit_category: Literal["Strong Fit", "Moderate Fit", "Potential Fit", "Not a Fit"] = Field(
        description="Overall candidate alignment rating based strictly on facts."
    )
    matching_qualifications: List[str] = Field(
        description="Skills or experiences required by the job that are explicitly proven by resume evidence."
    )
    missing_requirements: List[str] = Field(
        description="Job requirements lacking clear evidence in the resume. Never hallucinate or assume."
    )
    explanation: str = Field(
        description="Concise rationale for the rating based solely on verifiable resume content."
    )
    outreach_email: str = Field(
        description="A short, tailored recruiter outreach email mentioning the candidate's actual qualifications."
    )

class EvaluationRequest(BaseModel):
    candidate_name: str
    target_role: str
    resume_text: str
    company_name: str
    job_title: str
    job_description: str

class EvaluationResponse(BaseModel):
    id: int
    created_at: datetime
    candidate_name: str
    target_role: str
    resume_text: str
    company_name: str
    job_title: str
    job_description: str
    fit_category: str
    matching_qualifications: List[str]
    missing_requirements: List[str]
    explanation: str
    outreach_email: str

    class Config:
        from_attributes = True

class HistorySummary(BaseModel):
    id: int
    created_at: datetime
    candidate_name: str
    job_title: str
    fit_category: str

    class Config:
        from_attributes = True