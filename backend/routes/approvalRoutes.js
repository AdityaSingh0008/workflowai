import { Router } from "express";
import { listApprovals, decideApproval } from "../controllers/approvalController.js";
import { protect, requireManager } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, listApprovals);
router.post("/:id/decide", protect, requireManager, decideApproval);

export default router;
