from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.agents.graph import workflow_graph
from app.core.approvals import create_pending_approval
from app.models.models import AgentRequest, Department

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    user_email: str
    message: str


class ChatResponse(BaseModel):
    request_id: str
    department: str
    response: str
    retrieved_chunks: list[dict]
    proposed_tool: str | None
    requires_approval: bool
    tool_result: dict | None


@router.post("", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    initial_state = {"user_email": payload.user_email, "message": payload.message}
    result = workflow_graph.invoke(initial_state)

    agent_request = AgentRequest(
        department=Department(result.get("department", "general")),
        user_message=payload.message,
        agent_response=result.get("final_response", ""),
        tool_calls=[{
            "tool": result.get("proposed_tool"),
            "args": result.get("proposed_args"),
            "result": result.get("tool_result"),
        }] if result.get("proposed_tool") else [],
        retrieved_chunks=result.get("retrieved_chunks", []),
    )
    db.add(agent_request)
    db.commit()
    db.refresh(agent_request)

    if result.get("requires_approval") and result.get("proposed_tool"):
        create_pending_approval(
            db,
            request_id=agent_request.id,
            action_type=result["proposed_tool"],
            action_payload=result.get("proposed_args", {}),
        )

    return ChatResponse(
        request_id=agent_request.id,
        department=result.get("department", "general"),
        response=result.get("final_response", ""),
        retrieved_chunks=result.get("retrieved_chunks", []),
        proposed_tool=result.get("proposed_tool"),
        requires_approval=result.get("requires_approval", False),
        tool_result=result.get("tool_result"),
    )
