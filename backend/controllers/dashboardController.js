import AgentRequest from "../models/AgentRequest.js";
import Approval from "../models/Approval.js";

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalExecutions, completedWorkflows, pendingApprovals, recentActivity] = await Promise.all([
      AgentRequest.countDocuments({ user: userId }),
      AgentRequest.countDocuments({ user: userId, status: "completed" }),
      Approval.countDocuments({ requestedBy: userId, status: "pending" }),
      AgentRequest.find({ user: userId }).sort({ createdAt: -1 }).limit(6),
    ]);

    const agentBreakdown = await AgentRequest.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$agent", count: { $sum: 1 } } },
    ]);

    res.json({
      totalExecutions,
      completedWorkflows,
      pendingApprovals,
      leaveBalance: req.user.leaveBalance,
      agentBreakdown,
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
};
