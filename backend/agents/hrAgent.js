import { checkLeaveBalance, requestLeave } from "../tools/hrTools.js";

const DAYS_REGEX = /(\d+)\s*day/i;

export async function runHRAgent({ userId, message }) {
  const text = message.toLowerCase();

  // Intent: check leave balance
  if (/(balance|remaining|how many.*leave|leave.*left)/.test(text)) {
    const result = await checkLeaveBalance({ userId });
    return {
      response: `You currently have ${result.leaveBalance} day(s) of leave remaining.`,
      tool: "checkLeaveBalance",
      toolArgs: {},
      toolResult: result,
      requiresApproval: false,
    };
  }

  // Intent: request leave
  if (/(request|apply|book|take).*(leave|vacation|pto|off)/.test(text) || /leave/.test(text)) {
    const match = text.match(DAYS_REGEX);
    const days = match ? parseInt(match[1], 10) : 1;
    const result = await requestLeave({ userId, days, reason: message });

    const requiresApproval = result.status === "pending";
    return {
      response: requiresApproval
        ? `Your request for ${days} day(s) of leave exceeds 3 days, so it has been sent to your manager for approval.`
        : `Your request for ${days} day(s) of leave has been approved. Remaining balance: ${result.remainingBalance} day(s).`,
      tool: "requestLeave",
      toolArgs: { days, reason: message },
      toolResult: result,
      requiresApproval,
      approvalMeta: requiresApproval
        ? {
            actionType: "requestLeave",
            reason: `Leave request of ${days} days exceeds the 3-day auto-approval limit.`,
            payload: { leaveRequestId: result.leaveRequestId, days },
          }
        : null,
    };
  }

  return {
    response:
      "I can help with leave balances and leave requests. Try: \"What's my leave balance?\" or \"I want to request 2 days off.\"",
    tool: null,
    toolArgs: {},
    toolResult: null,
    requiresApproval: false,
  };
}
