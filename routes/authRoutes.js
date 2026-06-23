import express from "express";
import { loginUser, registerUser } from "../controller/authController.js";

const router = express.Router()

// ✅ Registration
router.post("/sign-up", registerUser)

// ✅ Login
router.post("/sign-in", loginUser)

// ✅ Refresh JWT token
router.post("/refresh", refreshToken);

// ✅ Profile Query
router.get("/profile", verifyJWT, getProfile)

export default router