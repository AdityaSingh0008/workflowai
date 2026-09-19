import mongoose from "mongoose";

const agentRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    agent: {
      type: String,
      enum: ["hr", "it", "finance", "general"],
      required: true,
    },
    tool: { type: String, default: null },
    toolArgs: { type: mongoose.Schema.Types.Mixed, default: {} },
    toolResult: { type: mongoose.Schema.Types.Mixed, default: null },
    response: { type: String, required: true },
    status: {
      type: String,
      enum: ["completed", "pending_approval", "rejected", "failed"],
      default: "completed",
    },
    approvalId: { type: mongoose.Schema.Types.ObjectId, ref: "Approval", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("AgentRequest", agentRequestSchema);
