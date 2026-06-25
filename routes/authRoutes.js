import express from "express";
import { 
  getProfile, 
  updateProfile,
  googleLogin, 
  loginUser, 
  logoutUser, 
  refreshToken, 
  registerUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDashboardStats
} from "../controller/authController.js";
import { verifyJWT, authorizeRoles } from "../middlewares/authMiddlewares.js";

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
router.put("/profile", verifyJWT, updateProfile)

// ✅ Logout user
router.post("/logout", verifyJWT, logoutUser);

// ✅ User Management (Admin Only)
router.get("/users", verifyJWT, authorizeRoles("admin"), getAllUsers)
router.patch("/users/:id/role", verifyJWT, authorizeRoles("admin"), updateUserRole)
router.delete("/users/:id", verifyJWT, authorizeRoles("admin"), deleteUser)

// ✅ Dashboard Stats (Admin Only)
router.get("/dashboard-stats", verifyJWT, authorizeRoles("admin"), getDashboardStats)

export default router