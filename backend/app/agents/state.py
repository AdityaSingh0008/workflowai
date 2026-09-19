from typing import TypedDict, Optional, Any


class GraphState(TypedDict, total=False):
    user_email: str
    message: str
    department: str              # hr | it | finance | general — set by the router
    retrieved_chunks: list[dict]
    proposed_tool: Optional[str]
    proposed_args: dict[str, Any]
    requires_approval: bool
    tool_result: Optional[dict]
    final_response: str
