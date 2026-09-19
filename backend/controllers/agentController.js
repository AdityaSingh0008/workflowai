import { runSupervisor } from "../agents/supervisorAgent.js";
import AgentRequest from "../models/AgentRequest.js";
import Approval from "../models/Approval.js";

export const executeAgent = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const outcome = await runSupervisor({ userId: req.user._id, message });

    const agentRequest = await AgentRequest.create({
      user: req.user._id,
      message,
      agent: outcome.agent,
      tool: outcome.tool,
      toolArgs: outcome.toolArgs || {},
      toolResult: outcome.toolResult || null,
      response: outcome.response,
      status: outcome.requiresApproval ? "pending_approval" : "completed",
    });

    let approval = null;
    if (outcome.requiresApproval && outcome.approvalMeta) {
      approval = await Approval.create({
        requestedBy: req.user._id,
        agentRequest: agentRequest._id,
        agent: outcome.agent,
        actionType: outcome.approvalMeta.actionType,
        payload: outcome.approvalMeta.payload,
        reason: outcome.approvalMeta.reason,
      });
      agentRequest.approvalId = approval._id;
      await agentRequest.save();
    }

    res.status(201).json({
      requestId: agentRequest._id,
      agent: outcome.agent,
      tool: outcome.tool,
      toolResult: outcome.toolResult,
      response: outcome.response,
      status: agentRequest.status,
      approval,
    });
  } catch (err) {
    next(err);
  }
};
