import { submitExpense, listMyExpenses, FINANCE_APPROVAL_THRESHOLD } from "../tools/financeTools.js";

const AMOUNT_REGEX = /(?:₹|rs\.?|inr|\$)?\s?([\d,]+(?:\.\d+)?)/i;

function extractAmount(text) {
  const match = text.match(AMOUNT_REGEX);
  if (!match) return 0;
  return parseFloat(match[1].replace(/,/g, ""));
}

export async function runFinanceAgent({ userId, message }) {
  const text = message.toLowerCase();

  if (/(my expenses|expense status|show.*expense)/.test(text)) {
    const result = await listMyExpenses({ userId });
    return {
      response: result.expenses.length
        ? `You have ${result.expenses.length} recent expense claim(s) on file.`
        : "You don't have any expense claims yet.",
      tool: "listMyExpenses",
      toolArgs: {},
      toolResult: result,
      requiresApproval: false,
    };
  }

  const amount = extractAmount(text);
  const result = await submitExpense({
    userId,
    amount,
    category: /travel|flight|cab|taxi|uber/.test(text) ? "travel" : /meal|food|lunch|dinner|client meeting/.test(text) ? "client_entertainment" : "general",
    description: message,
  });

  return {
    response: result.requiresApproval
      ? `Your reimbursement request of ₹${amount.toLocaleString()} exceeds the ₹${FINANCE_APPROVAL_THRESHOLD.toLocaleString()} auto-approval limit and has been sent to your manager for approval.`
      : `Your reimbursement request of ₹${amount.toLocaleString()} has been auto-approved.`,
    tool: "submitExpense",
    toolArgs: { amount, description: message },
    toolResult: result,
    requiresApproval: result.requiresApproval,
    approvalMeta: result.requiresApproval
      ? {
          actionType: "submitExpense",
          reason: `Expense amount ₹${amount.toLocaleString()} is at/above the ₹${FINANCE_APPROVAL_THRESHOLD.toLocaleString()} threshold.`,
          payload: { expenseId: result.expenseId, amount },
        }
      : null,
  };
}
