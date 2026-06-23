import dotenv from 'dotenv';
import connectDB from './config/db.js';
import http from 'http';
import logger from './utils/logger.js';
import app from './app.js';
import redisClient from './config/redis.js';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 4000;

(async () => {
    try {
        // Connect to the database
        await connectDB();
        

        // Start the server
        const server = http.createServer(app)

        server.listen(PORT, () => {
            logger.info(`✅ Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`);
        });

        // Handle unhandled promise rejections
        process.on("unhandledRejection", (err) => {
            logger.error(`💥 Unhandled Rejection: ${err.message}`);
            server.close(() => process.exit(1));
        });

        // Handle uncaught exceptions
        process.on("uncaughtException", (err) => {
            logger.error(`💣 Uncaught Exception: ${err.message}`);
            process.exit(1);
        });


    } catch (error) {
        logger.error(`❌ Failed to start server: ${error.message}`);
        process.exit(1);
    }
})()