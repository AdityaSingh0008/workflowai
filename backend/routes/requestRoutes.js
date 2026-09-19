import { Router } from "express";
import { listMyRequests } from "../controllers/requestController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, listMyRequests);

export default router;
