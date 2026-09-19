from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.approvals import decide_approval
from app.models.models import Approval, ApprovalStatus
from app.tools.actions import TOOL_REGISTRY

router = APIRouter(prefix="/approvals", tags=["approvals"])


class ApprovalDecision(BaseModel):
    approver_id: str
    approve: bool


@router.get("/pending")
def list_pending(db: Session = Depends(get_db)):
    rows = db.query(Approval).filter(Approval.status == ApprovalStatus.PENDING).all()
    return [
        {
            "id": r.id,
            "action_type": r.action_type,
            "action_payload": r.action_payload,
            "created_at": r.created_at,
        }
        for r in rows
    ]


@router.post("/{approval_id}/decide")
def decide(approval_id: str, payload: ApprovalDecision, db: Session = Depends(get_db)):
    approval = db.query(Approval).filter(Approval.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    if approval.status != ApprovalStatus.PENDING:
        raise HTTPException(status_code=400, detail="Approval already decided")

    approval = decide_approval(db, approval, payload.approver_id, payload.approve)

    result = None
    if payload.approve:
        fn = TOOL_REGISTRY.get(approval.action_type)
        if fn:
            result = fn(**approval.action_payload)

    return {"status": approval.status, "tool_result": result}
