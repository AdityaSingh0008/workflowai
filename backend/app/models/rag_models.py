import uuid

from sqlalchemy import Column, String, Text, ForeignKey, Integer, JSON
from sqlalchemy.orm import relationship

from app.core.db import Base

EMBEDDING_DIM = 1536  # matches text-embedding-3-small; change if you swap embedding models


def gen_uuid():
    return str(uuid.uuid4())


class PolicyChunk(Base):
    __tablename__ = "policy_chunks"

    id = Column(String, primary_key=True, default=gen_uuid)
    document_id = Column(String, ForeignKey("policy_documents.id"))
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    embedding = Column(JSON, nullable=False)

    document = relationship("PolicyDocument", back_populates="chunks")
