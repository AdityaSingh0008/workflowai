import User from "../models/User.js";
import LeaveRequest from "../models/LeaveRequest.js";

/** Returns the caller's current leave balance. */
export const checkLeaveBalance = async ({ userId }) => {
  const user = await User.findById(userId);
  return { tool: "checkLeaveBalance", leaveBalance: user.leaveBalance };
};

/** Files a leave request. Approval is required only for requests longer than 3 days. */
export const requestLeave = async ({ userId, days = 1, reason = "" }) => {
  const user = await User.findById(userId);
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + Number(days));

  const leave = await LeaveRequest.create({
    user: userId,
    startDate,
    endDate,
    days,
    reason,
    status: days > 3 ? "pending" : "approved",
  });

  if (days <= 3) {
    user.leaveBalance = Math.max(0, user.leaveBalance - days);
    await user.save();
  }

  return {
    tool: "requestLeave",
    leaveRequestId: leave._id,
    days,
    status: leave.status,
    remainingBalance: user.leaveBalance,
  };
};

export const HR_TOOLS = {
  checkLeaveBalance,
  requestLeave,
};

/** Actions requiring a human manager's sign-off before they take effect. */
export const HR_SENSITIVE_ACTIONS = new Set(["requestLeave.longDuration"]);
