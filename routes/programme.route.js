import express from "express";
import {authMiddleware} from "../controllers/auth.controller.js";
import {
    addPrograme, completeAnExercice,
    findProgrammeById,
    findProgrammesByClient, removeExerciceFromProgramme, uncompleteExercice,
    updateExercicesInProgramme
} from "../controllers/programe.controller.js";


const router = express.Router();

router.get("/getProgramme/:id",authMiddleware,findProgrammeById);
router.get("/getProgrammeByClient/:clientId",authMiddleware,findProgrammesByClient);
router.post("/addPrograme/:id",authMiddleware,addPrograme);
router.patch("/addExercicesToProgramme/:id",authMiddleware,updateExercicesInProgramme);
router.patch("/completeExercice/:id",authMiddleware,completeAnExercice)
router.patch("/uncompleteExercice/:id",authMiddleware,uncompleteExercice)
router.delete("/deleteExercice/:id",authMiddleware,removeExerciceFromProgramme)

export default router;