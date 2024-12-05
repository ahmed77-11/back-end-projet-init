import express from "express";
import {authMiddleware} from "../controllers/auth.controller.js";
import {getNotVerifiedCoaches, rejectCoach, verifierCoach} from "../controllers/admin.controller.js";
import {getClientPending} from "../controllers/coach.controller.js";



const router=express.Router();

router.get("/getNotVerfiedCoaches",authMiddleware,getNotVerifiedCoaches)
router.patch("/verifierCoach/:id",authMiddleware,verifierCoach)
router.patch("/rejectCoach/:id",authMiddleware,rejectCoach)

export default router;