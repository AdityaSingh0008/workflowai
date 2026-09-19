# WorkFlowAI – Multi-Agent Business Operations Platform

An agentic AI platform that automates internal HR, IT, and Finance workflows using
specialized AI agents, RAG, and tool calling. The system understands user requests,
retrieves relevant company policies, executes authorized actions through APIs, and
requires human approval for sensitive operations.

## Stack
- **Frontend:** React (Vite)
- **Backend:** FastAPI
- **Orchestration:** LangGraph (multi-agent graph + routing)
- **LLM:** Pluggable LLM API (OpenAI/Anthropic — set in `.env`)
- **Vector store:** PostgreSQL + pgvector (RAG over company policy docs)
- **DB:** PostgreSQL (SQLAlchemy models)

## Architecture

```
                        ┌─────────────────┐
                        │   React Client   │
                        └────────┬─────────┘
                                 │ REST
                        ┌────────▼─────────┐
                        │   FastAPI Layer   │
                        │  /chat  /approve  │
                        └────────┬─────────┘
                                 │
                        ┌────────▼─────────┐
                        │  LangGraph Router │
                        │  (Supervisor)     │
                        └───┬────┬────┬────┘
                    ┌───────┘    │    └───────┐
              ┌─────▼───┐  ┌─────▼───┐  ┌─────▼───┐
              │ HR Agent│  │IT Agent │  │Fin Agent│
              └────┬────┘  └────┬────┘  └────┬────┘
                   │            │             │
             ┌─────▼────────────▼─────────────▼─────┐
             │   RAG (pgvector) + Tool/Action Layer   │
             │   Human-in-the-loop approval gate      │
             └─────────────────────────────────────────┘
```

## Project layout

```
backend/
  app/
    agents/        # LangGraph supervisor + HR/IT/Finance agent nodes
    api/           # FastAPI routers (chat, approvals, documents)
    core/          # config, security, approval logic
    models/        # SQLAlchemy models (users, requests, approvals, audit log)
    rag/           # pgvector ingestion + retrieval
    tools/         # simulated HR/IT/Finance action tools
  main.py
  requirements.txt
  .env.example
frontend/
  src/
    api/           # axios client
    components/    # ChatWindow, ApprovalCard, Sidebar
    pages/         # Dashboard, Chat
  package.json
db/
  schema.sql       # Postgres + pgvector schema
docker-compose.yml
```

## Quick start

```bash
# 1. Database
docker compose up -d db

# 2. Backend
cd backend
cp .env.example .env   # add your LLM API key
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 3. Frontend
cd ../frontend
npm install
npm run dev
```

## Notes
This is a working scaffold: real LangGraph agent graph, real FastAPI routes,
real pgvector RAG pipeline, and a functioning human-approval workflow for
sensitive actions (e.g. salary changes, access grants, payments). Tool calls
to actual HR/IT/Finance systems (Workday, Jira, SAP, etc.) are stubbed as
mock functions in `backend/app/tools/` — swap them for real API clients.
