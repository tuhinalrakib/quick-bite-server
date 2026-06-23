import jwt from "jsonwebtoken";

// Access Token ভেরিফাই করার জন্য
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    return null; // টোকেন ইনভ্যালিড বা এক্সপায়ারড হলে
  }
};

// Refresh Token ভেরিফাই করার জন্য
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};