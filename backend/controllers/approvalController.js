import Approval from "../models/Approval.js";
import AgentRequest from "../models/AgentRequest.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";

export const listApprovals = async (req, res, next) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const approvals = await Approval.find(filter)
      .populate("requestedBy", "name email department")
      .populate("agentRequest", "message response")
      .sort({ createdAt: -1 });
    res.json({ approvals });
  } catch (err) {
    next(err);
  }
};

export const decideApproval = async (req, res, next) => {
  try {
    const { approve } = req.body;
    const approval = await Approval.findById(req.params.id);
    if (!approval) return res.status(404).json({ message: "Approval not found" });
    if (approval.status !== "pending") {
      return res.status(400).json({ message: "This approval has already been decided" });
    }

    approval.status = approve ? "approved" : "rejected";
    approval.decidedBy = req.user._id;
    approval.decidedAt = new Date();
    await approval.save();

    // Apply the side effect now that a human has signed off
    if (approve) {
      if (approval.actionType === "requestLeave") {
        const leave = await LeaveRequest.findById(approval.payload.leaveRequestId);
        if (leave) {
          leave.status = "approved";
          await leave.save();
          const user = await User.findById(leave.user);
          user.leaveBalance = Math.max(0, user.leaveBalance - leave.days);
          await user.save();
        }
      }
      if (approval.actionType === "submitExpense") {
        const expense = await Expense.findById(approval.payload.expenseId);
        if (expense) {
          expense.status = "approved";
          await expense.save();
        }
      }
    } else {
      if (approval.actionType === "requestLeave") {
        await LeaveRequest.findByIdAndUpdate(approval.payload.leaveRequestId, { status: "rejected" });
      }
      if (approval.actionType === "submitExpense") {
        await Expense.findByIdAndUpdate(approval.payload.expenseId, { status: "rejected" });
      }
    }

    await AgentRequest.findByIdAndUpdate(approval.agentRequest, {
      status: approve ? "completed" : "rejected",
    });

    res.json({ approval });
  } catch (err) {
    next(err);
  }
};
