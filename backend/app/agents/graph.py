from langgraph.graph import StateGraph, END

from app.agents.state import GraphState
from app.agents.supervisor import route, route_edge
from app.agents.department_agents import _make_agent_node, make_general_node
from app.agents.executor import execute_tool, executor_edge
from app.core.db import get_db


def build_graph():
    graph = StateGraph(GraphState)

    graph.add_node("router", route)
    graph.add_node("hr_agent", _make_agent_node("hr", get_db))
    graph.add_node("it_agent", _make_agent_node("it", get_db))
    graph.add_node("finance_agent", _make_agent_node("finance", get_db))
    graph.add_node("general_agent", make_general_node())
    graph.add_node("executor", execute_tool)

    graph.set_entry_point("router")

    graph.add_conditional_edges(
        "router",
        route_edge,
        {
            "hr": "hr_agent",
            "it": "it_agent",
            "finance": "finance_agent",
            "general": "general_agent",
        },
    )

    for dept_node in ["hr_agent", "it_agent", "finance_agent"]:
        graph.add_conditional_edges(
            dept_node,
            executor_edge,
            {"execute": "executor", "end": END},
        )

    graph.add_edge("general_agent", END)
    graph.add_edge("executor", END)

    return graph.compile()


workflow_graph = build_graph()
