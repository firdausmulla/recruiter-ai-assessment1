from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base

class EvaluationRecord(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    candidate_name = Column(String(255), nullable=False)
    target_role = Column(String(255), nullable=False)
    resume_text = Column(Text, nullable=False)
    
    company_name = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=False)
    job_description = Column(Text, nullable=False)
    
    fit_category = Column(String(50), nullable=False)
    matching_qualifications = Column(Text, nullable=False)  # JSON-stringified list
    missing_requirements = Column(Text, nullable=False)    # JSON-stringified list
    explanation = Column(Text, nullable=False)
    outreach_email = Column(Text, nullable=False)