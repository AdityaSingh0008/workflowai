/**
 * Supervisor/Orchestrator Agent.
 * Classifies an incoming natural-language request into a department, then
 * delegates execution to the matching specialist agent. Classification is
 * rule-based (keyword + intent scoring) so the whole platform runs with zero
 * external API keys — swap `classify()` for an LLM call if you want to layer
 * one in later, the rest of the pipeline is agent-agnostic.
 */
import { runHRAgent } from "./hrAgent.js";
import { runITAgent } from "./itAgent.js";
import { runFinanceAgent } from "./financeAgent.js";

const KEYWORDS = {
  hr: ["leave", "vacation", "pto", "holiday", "off", "onboarding", "benefits", "payroll", "hr"],
  it: ["laptop", "password", "vpn", "software", "install", "bug", "screen", "wifi", "network", "access", "login", "ticket", "it "],
  finance: ["expense", "reimburse", "reimbursement", "invoice", "budget", "salary", "payment", "₹", "$", "rupee", "spent", "finance"],
};

function classify(message) {
  const text = ` ${message.toLowerCase()} `;
  const scores = { hr: 0, it: 0, finance: 0 };

  for (const [dept, words] of Object.entries(KEYWORDS)) {
    for (const w of words) {
      if (text.includes(w)) scores[dept] += 1;
    }
  }

  const [best, bestScore] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return bestScore > 0 ? best : "general";
}

export async function runSupervisor({ userId, message }) {
  const agent = classify(message);

  let result;
  switch (agent) {
    case "hr":
      result = await runHRAgent({ userId, message });
      break;
    case "it":
      result = await runITAgent({ userId, message });
      break;
    case "finance":
      result = await runFinanceAgent({ userId, message });
      break;
    default:
      result = {
        response:
          "I couldn't confidently match this to HR, IT, or Finance. Could you rephrase, " +
          "or mention things like leave, a technical issue, or an expense?",
        tool: null,
        toolArgs: {},
        toolResult: null,
        requiresApproval: false,
      };
  }

  return { agent, ...result };
}
