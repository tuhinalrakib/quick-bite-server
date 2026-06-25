import express from "express"
import { errorhandler } from "./middlewares/errorHandler.js"
import rateLimit from "express-rate-limit"
import routes from "./routes/index.js"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"

const app = express()

app.use(helmet())

// Middleware setup
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://quick-bite-delta-six.vercel.app"
]

app.use(cors({
    origin : allowedOrigins,
    credentials : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json({ limit : "10mb"}))
app.use(express.urlencoded({ extended : true}))
app.use(cookieParser())
app.use(morgan("dev"))
// Rate limiter middleware
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS), // মিলিসেকেন্ড
  max: parseInt(process.env.RATE_LIMIT_MAX), // max requests per window
  message: "Too many requests, please try again later.",
});

app.use(limiter)

// API routes
app.use("/", routes)

// Error handling
app.use(errorhandler)

export default app