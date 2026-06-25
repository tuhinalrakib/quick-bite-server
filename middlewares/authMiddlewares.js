import User from "../models/User.js";
import { verifyAccessToken } from "../utils/verifyJWT.js";
import logger from "../utils/logger.js";


export const verifyJWT = async (req, res, next) => {
    let token;

    if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }
    // console.log(token)

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = verifyAccessToken(token);
        // console.log("Decoded token:", decoded); // Debugging log
        // req.user = await User.findById(decoded.id)
        req.user = decoded
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
}

// ✅ Check user role (Admin, Agent, or Regular User)
export const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id || req.user._id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Invalid token payload: no user id",
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const normalizedRole = user.role.toLowerCase();
      const allowed = roles.map(r => r.toLowerCase());

      if (!allowed.includes(normalizedRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Role '${user.role}' not authorized.`,
        });
      }

      next();
    } catch (error) {
      logger.error(`Authorization Error: ${error.message}`);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
};