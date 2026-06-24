import express from "express";
import { createFoodItem } from "../controller/foodController.js";
import { authorizeRoles, verifyJWT } from "../middlewares/authMiddlewares.js";
import multer from "multer";
import { optimizeImage, uploadToCloudinary } from "../middlewares/imageProcessMiddleWares.js";

const router = express.Router()
const upload = multer()

router.post("/",
    verifyJWT,
    // upload.single("image"),
    // optimizeImage,
    // uploadToCloudinary,
    authorizeRoles("admin"),
    createFoodItem
)

export default router