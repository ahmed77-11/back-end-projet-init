import express from "express";
import {
    getLoggedCoach,
    updateCoach,
    deleteLoggedInCoach,
    getAllCoaches,
    findCoachById, getClientPending
} from "../controllers/coach.controller.js";
import {authMiddleware} from "../controllers/auth.controller.js";

const router=express.Router();

router.get("/getCoach",authMiddleware,getLoggedCoach)
router.get("/getCoachById/:id",authMiddleware,findCoachById)
router.get("/getClientPending",authMiddleware,getClientPending)
router.patch("/updateCoach",authMiddleware,updateCoach)
router.delete("/deleteCoach",authMiddleware,deleteLoggedInCoach)
router.get("/getCoaches",authMiddleware,getAllCoaches)


export default router;