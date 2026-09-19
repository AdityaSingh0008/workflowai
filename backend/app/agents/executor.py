"""Executes the proposed tool call, unless it requires human approval (handled by API layer)."""
from app.agents.state import GraphState
from app.tools.actions import TOOL_REGISTRY


def execute_tool(state: GraphState) -> GraphState:
    tool_name = state.get("proposed_tool")
    if not tool_name or state.get("requires_approval"):
        return state

    fn = TOOL_REGISTRY.get(tool_name)
    if not fn:
        return state

    try:
        result = fn(**state.get("proposed_args", {}))
    except TypeError as e:
        result = {"error": f"invalid arguments for {tool_name}: {e}"}

    return {**state, "tool_result": result}


def executor_edge(state: GraphState) -> str:
    if state.get("proposed_tool") and not state.get("requires_approval"):
        return "execute"
    return "end"
