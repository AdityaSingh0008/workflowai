"""RAG pipeline: chunk + embed policy docs into pgvector, retrieve top-k on query."""
from __future__ import annotations

from openai import OpenAI
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.config import get_settings
from app.models.models import PolicyDocument, Department
from app.models.rag_models import PolicyChunk

settings = get_settings()
_client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key and settings.openai_api_key != "sk-..." else None

EMBED_MODEL = "text-embedding-3-small"


def embed(text: str) -> list[float]:
    if _client is None:
        # deterministic pseudo-embedding fallback so the pipeline runs without a key (dev/demo mode)
        import hashlib
        h = hashlib.sha256(text.encode()).digest()
        return [(b / 255.0) - 0.5 for b in (h * 96)][:1536]
    resp = _client.embeddings.create(model=EMBED_MODEL, input=text)
    return resp.data[0].embedding


def chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> list[str]:
    words = text.split()
    chunks, start = [], 0
    while start < len(words):
        end = start + chunk_size
        chunks.append(" ".join(words[start:end]))
        start = end - overlap
    return chunks


def ingest_document(db: Session, title: str, department: Department, text: str, source_path: str | None = None) -> PolicyDocument:
    doc = PolicyDocument(title=title, department=department, source_path=source_path)
    db.add(doc)
    db.flush()

    for i, chunk in enumerate(chunk_text(text)):
        db.add(PolicyChunk(document_id=doc.id, chunk_index=i, content=chunk, embedding=embed(chunk)))

    db.commit()
    db.refresh(doc)
    return doc


import math

def cosine_distance(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 1.0
    return 1.0 - (dot / (norm_a * norm_b))

def retrieve(db: Session, query: str, department: Department | None = None, top_k: int = 5) -> list[dict]:
    """Cosine-distance nearest-neighbor search in Python (SQLite compatible), optionally scoped to a department."""
    q_embedding = embed(query)

    stmt = select(
        PolicyChunk.content,
        PolicyChunk.embedding,
        PolicyDocument.title,
    ).join(PolicyDocument, PolicyChunk.document_id == PolicyDocument.id)

    if department is not None:
        stmt = stmt.where(PolicyDocument.department == department)

    rows = db.execute(stmt).all()
    
    results = []
    for r in rows:
        dist = cosine_distance(q_embedding, r.embedding)
        results.append({
            "content": r.content,
            "document_title": r.title,
            "distance": dist
        })
    
    results.sort(key=lambda x: x["distance"])
    return results[:top_k]
