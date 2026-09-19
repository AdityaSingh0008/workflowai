"""Run: python scripts/seed_policies.py  (from backend/, with venv active)
Loads a few sample policy documents into pgvector so RAG has something to retrieve."""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.db import SessionLocal
from app.models.models import Department
from app.rag.retriever import ingest_document

SAMPLE_DOCS = [
    ("HR Leave Policy", Department.HR,
     "Employees accrue 18 days of paid time off per year. PTO requests must be submitted at "
     "least 5 business days in advance for approval by a direct manager. Unused PTO up to 5 "
     "days carries over to the next calendar year. Sick leave is separate and unlimited for "
     "documented illness."),
    ("IT Access Policy", Department.IT,
     "All access grants to production systems require manager approval and are logged in the "
     "audit trail. Password resets can be self-served after identity verification. VPN access "
     "is granted to full-time employees and revoked automatically 24 hours after termination."),
    ("Finance Expense Policy", Department.FINANCE,
     "Expenses under $100 are auto-approved. Expenses between $100 and $1000 require manager "
     "approval. Expenses above $1000 require finance director approval and must include an "
     "itemized receipt. Payment releases to vendors require two-person approval."),
]


def main():
    db = SessionLocal()
    for title, dept, text in SAMPLE_DOCS:
        doc = ingest_document(db, title, dept, text)
        print(f"Ingested: {doc.title} ({dept})")
    db.close()


if __name__ == "__main__":
    main()
