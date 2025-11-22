import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import { listUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/all", authenticate, listUsers);

export default router;
