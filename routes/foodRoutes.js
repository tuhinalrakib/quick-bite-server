import express from "express";
import { createFoodItem, getAllFoodItems, deleteFoodItem, updateFoodItem } from "../controller/foodController.js";
import { authorizeRoles, verifyJWT } from "../middlewares/authMiddlewares.js";
import multer from "multer";
import { optimizeImage, uploadToCloudinary } from "../middlewares/imageProcessMiddleWares.js";

const router = express.Router()
const upload = multer()

router.get("/", getAllFoodItems)

router.post("/",
    verifyJWT,
    authorizeRoles("admin"),
    upload.single("image"),
    optimizeImage,
    uploadToCloudinary,
    createFoodItem
)

router.delete("/:id",
    verifyJWT,
    authorizeRoles("admin"),
    deleteFoodItem
)

router.put("/:id",
    verifyJWT,
    authorizeRoles("admin"),
    upload.single("image"),
    optimizeImage,
    uploadToCloudinary,
    updateFoodItem
)

export default router