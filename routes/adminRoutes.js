import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdminMiddleware.js";
import { dashboard } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", authenticate, isAdmin, dashboard);

export default router;
