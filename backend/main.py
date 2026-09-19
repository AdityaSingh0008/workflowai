from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.db import Base, engine
from app.models import models as _models          # noqa: F401  (ensures tables are registered)
from app.models import rag_models as _rag_models   # noqa: F401
from app.api import chat, approvals, documents

app = FastAPI(title="WorkFlowAI", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://frontend-eta-sable-50.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(approvals.router)
app.include_router(documents.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}
