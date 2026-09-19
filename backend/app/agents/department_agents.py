"""HR / IT / Finance agent nodes: RAG-grounded response + optional tool proposal."""
import json

from sqlalchemy.orm import Session

from app.agents.state import GraphState
from app.agents.llm import chat_completion
from app.core.approvals import needs_approval
from app.models.models import Department
from app.rag import retriever
from app.tools.actions import TOOL_REGISTRY

AGENT_PROMPTS = {
    "hr": """You are the HR agent for WorkFlowAI. Answer using the provided policy context.
If the user is asking to DO something actionable (request PTO, change salary, initiate termination,
check PTO balance), propose exactly one tool call. Available tools:
request_pto(user_email, start_date, end_date, reason)
lookup_pto_balance(user_email)
salary_change(user_email, new_salary, effective_date)
termination(user_email, last_working_day)
Respond ONLY as JSON: {"response": "...", "tool": "<tool_name_or_null>", "args": {...}}""",
    "it": """You are the IT agent for WorkFlowAI. Answer using the provided policy/knowledge-base context.
If actionable, propose exactly one tool call. Available tools:
reset_password(user_email)
create_it_ticket(user_email, subject, description, priority)
access_grant(user_email, system, access_level)
Respond ONLY as JSON: {"response": "...", "tool": "<tool_name_or_null>", "args": {...}}""",
    "finance": """You are the Finance agent for WorkFlowAI. Answer using the provided policy context.
If actionable, propose exactly one tool call. Available tools:
expense_approval(user_email, amount, category)
payment_release(vendor, amount, invoice_id)
Respond ONLY as JSON: {"response": "...", "tool": "<tool_name_or_null>", "args": {...}}""",
}

GENERAL_PROMPT = """You are the general assistant for WorkFlowAI. The request doesn't clearly
belong to HR, IT, or Finance. Answer helpfully and, if relevant, suggest which department
could help. Respond ONLY as JSON: {"response": "...", "tool": null, "args": {}}"""


def _make_agent_node(dept_key: str, db_factory):
    department_enum = {
        "hr": Department.HR,
        "it": Department.IT,
        "finance": Department.FINANCE,
    }.get(dept_key)

    def node(state: GraphState) -> GraphState:
        db: Session = next(db_factory())
        try:
            chunks = retriever.retrieve(db, state["message"], department=department_enum, top_k=5)
        finally:
            db.close()

        context = "\n\n".join(f"[{c['document_title']}] {c['content']}" for c in chunks) or "No matching policy found."
        prompt = AGENT_PROMPTS[dept_key]
        user_prompt = f"Company policy context:\n{context}\n\nUser request: {state['message']}"

        raw = chat_completion(prompt, user_prompt)
        try:
            parsed = json.loads(raw)
        except Exception:
            parsed = {"response": raw, "tool": None, "args": {}}

        tool = parsed.get("tool")
        args = parsed.get("args", {}) or {}
        requires_approval = bool(tool) and needs_approval(tool)

        return {
            **state,
            "retrieved_chunks": chunks,
            "final_response": parsed.get("response", ""),
            "proposed_tool": tool if tool in TOOL_REGISTRY else None,
            "proposed_args": args,
            "requires_approval": requires_approval,
        }

    return node


def make_general_node():
    def node(state: GraphState) -> GraphState:
        raw = chat_completion(GENERAL_PROMPT, state["message"])
        try:
            parsed = json.loads(raw)
        except Exception:
            parsed = {"response": raw}
        return {
            **state,
            "final_response": parsed.get("response", raw),
            "proposed_tool": None,
            "proposed_args": {},
            "requires_approval": False,
            "retrieved_chunks": [],
        }

    return node
