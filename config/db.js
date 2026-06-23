import mongoose from "mongoose";
import logger from "../utils/logger.js";
import dotenv from "dotenv"
dotenv.config()

const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI

    try {
        const conn = await mongoose.connect(MONGO_URI)
        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        logger.error(`❌ MongoDB Connection Failed: ${error.message}`);
        process.exit(1);
    }
}  

export default connectDB;