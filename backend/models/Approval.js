import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema(
  {
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    agentRequest: { type: mongoose.Schema.Types.ObjectId, ref: "AgentRequest", required: true },
    agent: { type: String, enum: ["hr", "it", "finance"], required: true },
    actionType: { type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    decidedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Approval", approvalSchema);
