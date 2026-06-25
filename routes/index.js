import express from "express"
import authRoutes from "./authRoutes.js"
import foodRoutes from "./foodRoutes.js"
import paymentRoutes from "./paymentRoutes.js"

const router = express.Router()

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 API is running successfully!",
    })
})

router.use("/auth", authRoutes)
router.use("/food", foodRoutes)
router.use("/payment", paymentRoutes)

export default router