import { createTicket, listMyTickets } from "../tools/itTools.js";

function inferPriority(text) {
  if (/(urgent|asap|critical|down|can't work|cannot work)/.test(text)) return "urgent";
  if (/(important|soon|blocking)/.test(text)) return "high";
  return "normal";
}

export async function runITAgent({ userId, message }) {
  const text = message.toLowerCase();

  if (/(my tickets|ticket status|show.*ticket)/.test(text)) {
    const result = await listMyTickets({ userId });
    return {
      response: result.tickets.length
        ? `You have ${result.tickets.length} recent ticket(s) on file.`
        : "You don't have any tickets yet.",
      tool: "listMyTickets",
      toolArgs: {},
      toolResult: result,
      requiresApproval: false,
    };
  }

  // Default: treat any IT-routed message as a technical issue → open a ticket
  const priority = inferPriority(text);
  const result = await createTicket({
    userId,
    subject: message.slice(0, 80),
    description: message,
    priority,
  });

  return {
    response: `I've logged this as IT ticket #${String(result.ticketId).slice(-6).toUpperCase()} with ${priority} priority. Our IT team will follow up.`,
    tool: "createTicket",
    toolArgs: { subject: message.slice(0, 80), description: message, priority },
    toolResult: result,
    requiresApproval: false,
  };
}
