import express from "express";
import {authMiddleware} from "../controllers/auth.controller.js";
import {
    addExercice,
    deleteExercice, getAllCategories,
    getAllexercices,
    getExercice, getExercicesByAddedByUser,
    updateExercice
} from "../controllers/exercice.controller.js";

const router=express.Router();

router.get("/getExercices",authMiddleware,getAllexercices)
router.get("/getExercice/:id",authMiddleware,getExercice)
router.get("/myExercices",authMiddleware,getExercicesByAddedByUser)
router.get("/getAllCategories",authMiddleware,getAllCategories)
router.post("/addExercice",authMiddleware,addExercice)
router.patch("/updateExercice/:id",authMiddleware,updateExercice)
router.delete("/deleteExercice/:id",authMiddleware,deleteExercice)

export default router;