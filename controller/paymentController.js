import crypto from "crypto";
import asyncHandler from "express-async-handler";

/**
 * @desc    Generate secure MD5 hash for PayHere checkout
 * @route   POST /payment/payhere-hash
 * @access  Private
 */
export const getPayHereHash = asyncHandler(async (req, res) => {
    const { orderId, amount, currency } = req.body;

    if (!orderId || !amount || !currency) {
        res.status(400);
        throw new Error("orderId, amount, and currency are required");
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    let merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    // Decode base64 merchant secret if applicable
    if (merchantSecret) {
        try {
            const decoded = Buffer.from(merchantSecret, "base64").toString("utf-8");
            if (/^[a-zA-Z0-9]+$/.test(decoded)) {
                merchantSecret = decoded;
            }
        } catch (error) {
            // Keep original if decoding fails
        }
    }

    const formattedAmount = Number(amount).toFixed(2);

    const secretHash = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();

    const concatString = merchantId + orderId + formattedAmount + currency + secretHash;
    const finalHash = crypto.createHash("md5").update(concatString).digest("hex").toUpperCase();

    res.status(200).json({
        success: true,
        hash: finalHash,
        merchantId,
    });
});
