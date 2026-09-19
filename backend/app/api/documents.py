from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.models import Department
from app.rag.retriever import ingest_document

router = APIRouter(prefix="/documents", tags=["documents"])


class IngestRequest(BaseModel):
    title: str
    department: Department
    text: str


@router.post("/ingest")
def ingest(payload: IngestRequest, db: Session = Depends(get_db)):
    doc = ingest_document(db, payload.title, payload.department, payload.text)
    return {"document_id": doc.id, "title": doc.title, "department": doc.department}
