import express from "express";
import { getUserProfile, signUpAction, signInAction, verifyOTP, resendOTP, forgotPasswordAction, logoutAction, setPreferences, updateUserPreferences, googleSignIn, generateMealPlan } from "../controller/user.controller.js";
import { body } from "express-validator";
import { authenticate } from "../middlewares/auth.js";
// import { googleAuth } from "../controller/user.controller.js";

const router = express.Router();


router.post("/sign-up",
    body("username", "username is required").notEmpty(),
    body("email", "email id is required").notEmpty(),
    body("email", "invalid email id").isEmail(),
    body("password", "password is required").notEmpty(),
    signUpAction);

router.post("/verify-otp", verifyOTP);
router.post("/sign-in", signInAction);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPasswordAction);
router.post("/logout", authenticate, logoutAction);
router.post('/setPreferences', authenticate, setPreferences);
router.post("/update-profile", authenticate, updateUserPreferences);
router.get("/profile", authenticate, getUserProfile);
// router.post('/google-auth', googleAuth);
router.post("/google-login", googleSignIn);
router.get("/generate-meal-plan", authenticate, generateMealPlan);

export default router;