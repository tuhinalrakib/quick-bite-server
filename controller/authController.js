import asyncHandler from "express-async-handler"
import { OAuth2Client } from "google-auth-library"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/User.js"
import { deleteRefreshTokenCache, getRefreshTokenCache, setRefreshTokenCache } from "../services/caching/tokenCaching.js"

dotenv.config()

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const accessSecret = process.env.JWT_ACCESS_SECRET
const refreshSecret = process.env.JWT_REFRESH_SECRET

/*==========================================================
                Helpers using HMAC secrets
==========================================================*/
const createAccessToken = (user) => {
    if (!accessSecret) {
        throw new Error("JWT_ACCESS_SECRET missing");
    }
    return jwt.sign(
        {
            id: user._id.toString(),
            role: user.role
        },
        accessSecret,
        {
            expiresIn: "1h"
        }
    )
}

const createRefreshToken = (user) => {
    if (!refreshSecret) {
        throw new Error("JWT_REFRESH_SECRET missing");
    }
    return jwt.sign(
        {
            id: user._id.toString(),
            role: user.role
        },
        refreshSecret,
        {
            expiresIn: "7d"
        }
    )
}

/*==========================================================
                REGISTER
==========================================================*/
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword, phone } = req.body

    // console.log(name, email, password, confirmPassword, phone)

    if (!name || !email || !password || !confirmPassword || !phone) {
        return res.status(400).json({ message: "Name, email, phone and password are required" });
    }

    if (password !== confirmPassword) {
        return res.status(404).json({
            message: "Password didn't match"
        })
    }

    // basic normalization
    const normalizedEmail = String(email).toLowerCase().trim();

    const exist = await User.findOne({ email: normalizedEmail })
    console.log(exist)
    if (exist) {
        return res.status(409).json({
            message: "Email already exist"
        })
    }

    const user = await User.create({
        name,
        email,
        password,
        role: 'admin',
        phone
    })

    if (!user) {
        return res.status(503).json({
            success: false,
            message: "Cannot register at this moment"
        })
    }

    return res.status(201).json({
        success: true,
        message: "Register Successfully!"
    })
})

/*==========================================================
                LOGIN
==========================================================*/
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    // basic normalization
    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail })

    if (!user) return res.status(401).json({ message: "User not found" });
    if (!user.isActive) {
        return res.status(403).json({ message: "User did not active" });
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken(user);

    await setRefreshTokenCache(refreshToken, user._id.toString())

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    };

    
    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
    success : true,
    message: "Logged in",
    user
  });
})

/*==========================================================
                REFRESH TOKEN
==========================================================*/
export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // কুকি থেকে রিফ্রেশ টোকেন রিড করুন

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    await deleteRefreshTokenCache(refreshToken);
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const storedUserId = await getRefreshTokenCache(refreshToken);

  if (!storedUserId || storedUserId !== payload.id) {
    await deleteRefreshTokenCache(refreshToken);
    return res.status(403).json({ message: "Refresh token revoked" });
  }

  const user = await User.findById(payload.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const accessToken = createAccessToken(user);

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 1000,
  });

  return res.status(202).json({
    message: "Token refreshed",
  });
});


/*==========================================================
                LOGOUT
==========================================================*/
export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.refreshToken

  if (refreshToken) {
    await deleteRefreshTokenCache(refreshToken);
  }

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  // কুকি ক্লিয়ার করুন
  res.clearCookie("accessToken", { ...cookieOptions });
  res.clearCookie("refreshToken", { ...cookieOptions });

  return res.json({ message: "Logged out successfully" });
});


/*==========================================================
                GOOGLE Login
==========================================================*/
export const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  // 🔥 Access Token দিয়ে user info আনো
  const { data } = await axios.get(
    `https://www.googleapis.com/oauth2/v3/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // const payload = ticket.getPayload();
  const { email, name, picture, sub } = data;
  const providerId = sub

  let user = await User.findOne({ email: String(email).toLowerCase().trim() });

  if (!user) {
    user = await User.create({
      name: String(name),
      email: String(email).toLowerCase().trim(),
      image: picture,
      googleId: providerId,
      provider: "google",
      role: "user",
      isVerified: true
    });
  } else {
    // update provider fields if missing
    if (!user.googleId && providerId) user.googleId = providerId;
    if (!user.image && picture) user.image = picture;
    await user.save();
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  await setRefreshTokenCache(refreshToken, user._id.toString());

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.json({
    message: "Google Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image || user.avatar,
    }
  });
});


/*==========================================================
                Get Profile
==========================================================*/
export const getProfile = asyncHandler(async (req, res) => {
  const userData = await User.findById(req.user.id)

  if (!userData) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    success : true,
    user
  });
});