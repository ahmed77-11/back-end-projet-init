import express from "express";
import {
    resetPassword,
    sentVerifCodeForForgatePassword,
    signInAdmin,
    signInClient,
    signInCoach,
    signUpClient,
    signUpCoach, verifCodeForgotPassword,
    verifyEmail
} from "../controllers/auth.controller.js";
import {upload} from "../helpers/uploads.js";

const router=express.Router();

router.post("/signupclient",signUpClient);
router.post("/signupcoach",upload.fields([{ name: 'cv' }, { name: 'diplome' }]),signUpCoach);
router.post("/verifEmail",verifyEmail);
router.post("/signinAdmin",signInAdmin);
router.post("/signinClient",signInClient);
router.post("/signinCoach",signInCoach);
router.post("/signinAdmin",signInAdmin);
router.post("/forgetPassword",sentVerifCodeForForgatePassword);
router.post("/verifForgotPassword",verifCodeForgotPassword)
router.post("resetPassword",resetPassword);


export default router;