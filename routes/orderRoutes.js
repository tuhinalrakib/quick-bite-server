import express from "express";
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
} from "../controller/orderController.js";
import { authorizeRoles, verifyJWT } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Publicly authenticated user order routes
router.post("/", verifyJWT, createOrder);
router.get("/", verifyJWT, getMyOrders);

// Admin-only order routes
router.get(
    "/all",
    verifyJWT,
    authorizeRoles("admin"),
    getAllOrders
);
router.patch("/:id/status", verifyJWT, authorizeRoles("admin"), updateOrderStatus);

export default router;
