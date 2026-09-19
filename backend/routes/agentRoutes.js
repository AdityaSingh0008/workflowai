import { Router } from "express";
import { executeAgent } from "../controllers/agentController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/execute", protect, executeAgent);

export default router;
