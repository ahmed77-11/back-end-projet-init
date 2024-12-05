import express from "express";
import {authMiddleware} from "../controllers/auth.controller.js";
import {followCoach} from "../controllers/client.controller.js";
import {acceptClient, rejectClient} from "../controllers/coach.controller.js";

const router=express.Router();

router.get("/followCoach/:coachId",authMiddleware,followCoach);
router.patch("/acceptRequest/:clientId",authMiddleware,acceptClient);
router.patch("/rejectRequest/:clientId",authMiddleware,rejectClient);


export default router;