import logger from "../utils/logger.js";


export const errorhandler = (err, req, res, next) => {
    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        message = `Resource not found with id: ${err.value}`;
        statusCode = 404;
    }

    // Mongoose validation error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)
        message = `Duplicate value entered for field: ${field}`;
        statusCode = 400;
    }

    // JWT invalid signature
    if (err.name === "JsonWebTokenError") {
        message = "Invalid token, please login again";
        statusCode = 401;
    }

    // JWT expired
    if (err.name === "TokenExpiredError") {
        message = "Token expired, please login again"
        statusCode = 401
    }

    // Log the error (server-side only)
    logger.error(`${message} | ${err.stack}`)

    res.status(statusCode).json({
        success: false,
        message,
        // Show stack trace only in development
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    })
}


/**
* Catch unhandled routes (404)
*/
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}