import express from "express";
import {
    deleteLoggedInClient,
    findClientById,
    getAllCoachs,
    getLoggedClient, searchCoach,
    updateClient
} from "../controllers/client.controller.js";
import {authMiddleware} from "../controllers/auth.controller.js";

const router=express.Router();

router.get("/getClient",authMiddleware,getLoggedClient)
router.get("/getClientById/:id",authMiddleware,findClientById)
router.get("/searchCoachs",authMiddleware,searchCoach)
router.get("/getCoachs",authMiddleware,getAllCoachs)
router.patch("/updateClient",authMiddleware,updateClient)
router.delete("/deleteClient",authMiddleware,deleteLoggedInClient)



export default router;