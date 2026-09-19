"""Supervisor node: classifies the incoming request into hr / it / finance / general."""
import json

from app.agents.state import GraphState
from app.agents.llm import chat_completion

ROUTER_SYSTEM_PROMPT = """You are a routing classifier for an internal business-operations assistant.
Classify the user's message into exactly one department: "hr", "it", "finance", or "general".
Respond with ONLY a JSON object: {"department": "<one of hr|it|finance|general>"}"""


def route(state: GraphState) -> GraphState:
    raw = chat_completion(ROUTER_SYSTEM_PROMPT, state["message"])
    try:
        parsed = json.loads(raw)
        department = parsed.get("department", "general")
    except Exception:
        # keyword fallback if the LLM (or dev stub) doesn't return clean JSON
        msg = state["message"].lower()
        if any(w in msg for w in ["salary", "invoice", "expense", "payment", "budget"]):
            department = "finance"
        elif any(w in msg for w in ["password", "access", "vpn", "laptop", "ticket", "software"]):
            department = "it"
        elif any(w in msg for w in ["pto", "leave", "vacation", "onboarding", "benefits", "payroll"]):
            department = "hr"
        else:
            department = "general"

    if department not in {"hr", "it", "finance", "general"}:
        department = "general"

    return {**state, "department": department}


def route_edge(state: GraphState) -> str:
    return state.get("department", "general")
