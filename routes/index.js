import express from "express"
import authRoutes from "./authRoutes.js"

const router = express.Router()

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 API is running successfully!",
    })
})

router.use("/auth", authRoutes)

export default router