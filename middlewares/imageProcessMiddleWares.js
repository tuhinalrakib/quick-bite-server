import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";

/**
 * Resize + optimize image using Sharp
 * Adds processed image buffer to req.processedImage
 */

export const optimizeImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image required" });
        }
        const optimizedBuffer = await sharp(req.file.buffer)
            .resize(500, 500, { fit: "cover" })
            .jpeg({ quality: 80 })
            .toBuffer();

        req.imageBuffer = optimizedBuffer;

        next()
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const uploadToCloudinary = (req, res, next) => {
    try {
        if (!req.imageBuffer) {
            return res.status(400).json({ message: "No processed image found" });
        }

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "rafishop", // optional
            },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ message: error.message });
                }
               
                // Save image URL & public_id
                req.cloudinaryData = result.secure_url;
                next();
            }
        );

        stream.end(req.imageBuffer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};