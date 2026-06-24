import express from "express"
import authRoutes from "./authRoutes.js"
import foodRoutes from "./foodRoutes.js"

const router = express.Router()

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 API is running successfully!",
    })
})

router.use("/auth", authRoutes)
router.use("/food", foodRoutes)

export default router