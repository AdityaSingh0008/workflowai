from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.models import Approval, ApprovalStatus

settings = get_settings()


def needs_approval(action_type: str) -> bool:
    return action_type in settings.approval_required_set


def create_pending_approval(db: Session, request_id: str, action_type: str, action_payload: dict) -> Approval:
    approval = Approval(
        request_id=request_id,
        action_type=action_type,
        action_payload=action_payload,
        status=ApprovalStatus.PENDING,
    )
    db.add(approval)
    db.commit()
    db.refresh(approval)
    return approval


def decide_approval(db: Session, approval: Approval, approver_id: str, approve: bool) -> Approval:
    from datetime import datetime

    approval.status = ApprovalStatus.APPROVED if approve else ApprovalStatus.REJECTED
    approval.approver_id = approver_id
    approval.decided_at = datetime.utcnow()
    db.commit()
    db.refresh(approval)
    return approval
