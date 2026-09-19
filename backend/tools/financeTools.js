import Expense from "../models/Expense.js";

const APPROVAL_THRESHOLD = Number(process.env.FINANCE_APPROVAL_THRESHOLD || 2000);

/** Files an expense/reimbursement claim. Auto-approves small amounts, otherwise stays pending. */
export const submitExpense = async ({ userId, amount, category = "general", description = "" }) => {
  const requiresApproval = Number(amount) >= APPROVAL_THRESHOLD;
  const expense = await Expense.create({
    user: userId,
    amount,
    category,
    description,
    status: requiresApproval ? "pending" : "approved",
  });

  return {
    tool: "submitExpense",
    expenseId: expense._id,
    amount: expense.amount,
    status: expense.status,
    requiresApproval,
  };
};

export const listMyExpenses = async ({ userId }) => {
  const expenses = await Expense.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
  return { tool: "listMyExpenses", expenses };
};

export const FINANCE_TOOLS = {
  submitExpense,
  listMyExpenses,
};

export const FINANCE_APPROVAL_THRESHOLD = APPROVAL_THRESHOLD;
