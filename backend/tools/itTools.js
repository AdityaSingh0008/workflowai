import ITTicket from "../models/ITTicket.js";

/** Creates a support ticket for a technical issue. */
export const createTicket = async ({ userId, subject, description, priority = "normal" }) => {
  const ticket = await ITTicket.create({ user: userId, subject, description, priority });
  return {
    tool: "createTicket",
    ticketId: ticket._id,
    priority: ticket.priority,
    status: ticket.status,
  };
};

/** Returns the caller's open/in-progress tickets. */
export const listMyTickets = async ({ userId }) => {
  const tickets = await ITTicket.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
  return { tool: "listMyTickets", tickets };
};

export const IT_TOOLS = {
  createTicket,
  listMyTickets,
};
