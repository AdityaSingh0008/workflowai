-- Enable pgvector before SQLAlchemy creates tables (Base.metadata.create_all does the rest)
CREATE EXTENSION IF NOT EXISTS vector;

-- Optional: HNSW index for fast approximate nearest-neighbor search once policy_chunks exists.
-- Run this after the app has created tables on first startup.
-- CREATE INDEX IF NOT EXISTS policy_chunks_embedding_idx
--   ON policy_chunks USING hnsw (embedding vector_cosine_ops);
