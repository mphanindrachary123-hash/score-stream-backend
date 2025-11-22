import { Router } from "express";
import authenticate from "../middleware/authMiddleware.js";
import { findMatches } from "../controllers/matchController.js";

const router = Router();

router.post("/find", authenticate, findMatches);

export default router;
