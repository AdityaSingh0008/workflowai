"""
Simulated action tools the agents can call. Swap the bodies of these functions
for real integrations (Workday, BambooHR, Jira, ServiceNow, SAP, NetSuite, etc).
Each tool returns a dict describing what happened, so it can be logged/audited.
"""
from datetime import datetime

# Actions in this set always require human approval before executing (see core/approvals.py)
SENSITIVE_ACTIONS = {
    "salary_change",
    "expense_approval",
    "access_grant",
    "termination",
    "payment_release",
}


def request_pto(user_email: str, start_date: str, end_date: str, reason: str) -> dict:
    return {
        "tool": "request_pto",
        "status": "submitted",
        "user_email": user_email,
        "start_date": start_date,
        "end_date": end_date,
        "reason": reason,
        "submitted_at": datetime.utcnow().isoformat(),
    }


def lookup_pto_balance(user_email: str) -> dict:
    # stubbed balance; wire up to real HRIS
    return {"tool": "lookup_pto_balance", "user_email": user_email, "balance_days": 12}


def salary_change(user_email: str, new_salary: float, effective_date: str) -> dict:
    return {
        "tool": "salary_change",
        "status": "executed",
        "user_email": user_email,
        "new_salary": new_salary,
        "effective_date": effective_date,
    }


def reset_password(user_email: str) -> dict:
    return {"tool": "reset_password", "status": "executed", "user_email": user_email}


def create_it_ticket(user_email: str, subject: str, description: str, priority: str = "normal") -> dict:
    return {
        "tool": "create_it_ticket",
        "status": "created",
        "ticket_id": f"IT-{abs(hash(subject)) % 10000}",
        "user_email": user_email,
        "subject": subject,
        "priority": priority,
    }


def access_grant(user_email: str, system: str, access_level: str) -> dict:
    return {
        "tool": "access_grant",
        "status": "executed",
        "user_email": user_email,
        "system": system,
        "access_level": access_level,
    }


def expense_approval(user_email: str, amount: float, category: str) -> dict:
    return {
        "tool": "expense_approval",
        "status": "executed",
        "user_email": user_email,
        "amount": amount,
        "category": category,
    }


def payment_release(vendor: str, amount: float, invoice_id: str) -> dict:
    return {
        "tool": "payment_release",
        "status": "executed",
        "vendor": vendor,
        "amount": amount,
        "invoice_id": invoice_id,
    }


def termination(user_email: str, last_working_day: str) -> dict:
    return {
        "tool": "termination",
        "status": "executed",
        "user_email": user_email,
        "last_working_day": last_working_day,
    }


TOOL_REGISTRY = {
    "request_pto": request_pto,
    "lookup_pto_balance": lookup_pto_balance,
    "salary_change": salary_change,
    "reset_password": reset_password,
    "create_it_ticket": create_it_ticket,
    "access_grant": access_grant,
    "expense_approval": expense_approval,
    "payment_release": payment_release,
    "termination": termination,
}
