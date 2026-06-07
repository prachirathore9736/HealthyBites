import express from "express";
import { adminSignIn, createMeal, updateMeal, deleteMeal, getAllMeals, saveMealsInBulk, getMealById } from "../controller/admin.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/sign-in", verifyAdmin, adminSignIn);
router.post("/meals/bulk", verifyAdmin, saveMealsInBulk);
router.post("/meals", verifyAdmin, createMeal);
router.get("/meals", verifyAdmin, getAllMeals);
router.get("/meals/:id", verifyAdmin, getMealById);
router.put("/meals/:id", verifyAdmin, updateMeal);
router.delete("/meals/:id", verifyAdmin, deleteMeal);

export default router;