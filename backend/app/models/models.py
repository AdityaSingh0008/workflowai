import uuid
import enum
from datetime import datetime

from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship

from app.core.db import Base


def gen_uuid():
    return str(uuid.uuid4())


class Department(str, enum.Enum):
    HR = "hr"
    IT = "it"
    FINANCE = "finance"
    GENERAL = "general"


class ApprovalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    NOT_REQUIRED = "not_required"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="employee")  # employee, manager, hr_admin, it_admin, finance_admin
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    requests = relationship("AgentRequest", back_populates="user")


class PolicyDocument(Base):
    __tablename__ = "policy_documents"

    id = Column(String, primary_key=True, default=gen_uuid)
    department = Column(Enum(Department), nullable=False)
    title = Column(String, nullable=False)
    source_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    chunks = relationship("PolicyChunk", back_populates="document", cascade="all, delete-orphan")


class AgentRequest(Base):
    """A single user turn processed by the multi-agent graph."""
    __tablename__ = "agent_requests"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    department = Column(Enum(Department), nullable=False)
    user_message = Column(Text, nullable=False)
    agent_response = Column(Text, nullable=True)
    tool_calls = Column(JSON, nullable=True)          # list of {tool, args, result}
    retrieved_chunks = Column(JSON, nullable=True)    # RAG citations used
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="requests")
    approval = relationship("Approval", back_populates="request", uselist=False)


class Approval(Base):
    """Human-in-the-loop gate for sensitive actions."""
    __tablename__ = "approvals"

    id = Column(String, primary_key=True, default=gen_uuid)
    request_id = Column(String, ForeignKey("agent_requests.id"))
    action_type = Column(String, nullable=False)
    action_payload = Column(JSON, nullable=False)
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING)
    approver_id = Column(String, ForeignKey("users.id"), nullable=True)
    decided_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("AgentRequest", back_populates="approval")


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(String, primary_key=True, default=gen_uuid)
    actor_id = Column(String, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
