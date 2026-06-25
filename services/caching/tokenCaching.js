import redisClient from "../../config/redis.js"

const REFRESH_TTL = 7 * 24 * 60 * 60;

// ✅ Save refresh token (token -> userId)
export const setRefreshTokenCache  = async (token, userId) => {
    return redisClient.set(`rafiShopRefresh:${token}`, userId, "EX", REFRESH_TTL)
}

// ✅ Get userId using refresh token
export const getRefreshTokenCache = async(token)=>{
    const userId = await redisClient.get(`rafiShopRefresh:${token}`)
    return userId || null
}

export const deleteRefreshTokenCache = async(token)=>{
    await redisClient.del(`rafiShopRefresh:${token}`)
}

// Optional: Delete all tokens for a user (if needed)
export const deleteAllRefreshTokensByUser = async (userId) => {
  const keys = await redisClient.keys(`rafiShopRefresh:*`);

  for (const key of keys) {
    const storedUser = await redisClient.get(key);
    if (storedUser === userId) {
      await redisClient.del(key);
    }
  }
};