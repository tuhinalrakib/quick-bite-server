import express from "express";
import { getProfile, googleLogin, loginUser, logoutUser, refreshToken, registerUser } from "../controller/authController.js";
import { verifyJWT } from "../middlewares/authMiddlewares.js";

const router = express.Router()

// ✅ Registration
router.post("/sign-up", registerUser)

// ✅ Login
router.post("/sign-in", loginUser)

// ✅ Refresh JWT token
router.post("/refresh", refreshToken);

router.post("/google", googleLogin)

// ✅ Profile Query
router.get("/profile", verifyJWT, getProfile)

// ✅ Logout user
router.post("/logout", verifyJWT, logoutUser);

export default router