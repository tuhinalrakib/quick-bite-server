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

    const merchantId = process.env.PAYHERE_MERCHANT_ID
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET

    // Format amount to exactly 2 decimal places (no comma formatting)
    const formattedAmount = Number(amount).toFixed(2);

    // Inner MD5 of merchant secret (in uppercase)
    const secretHash = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();

    // Outer MD5 signature (in uppercase)
    const concatString = merchantId + orderId + formattedAmount + currency + secretHash;
    const finalHash = crypto.createHash("md5").update(concatString).digest("hex").toUpperCase();

    res.status(200).json({
        success: true,
        hash: finalHash,
        merchantId,
    });
});
