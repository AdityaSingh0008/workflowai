import AgentRequest from "../models/AgentRequest.js";

export const listMyRequests = async (req, res, next) => {
  try {
    const requests = await AgentRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ requests });
  } catch (err) {
    next(err);
  }
};
