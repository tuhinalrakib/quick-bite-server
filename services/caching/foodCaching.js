import redisClient from "../../config/redis.js"

export const setFoodCache = async (key, value, ttl = 3600) => {
    await redisClient.set(
        `quickBite:${key}`,
        JSON.stringify(value),
        "EX",
        ttl
    )
}

export const getFoodCache = async (key) => {
    const data = await redisClient.get(`quickBite:${key}`);
    return data ? JSON.parse(data) : null;
}

export const deleteFoodCache = async () => {
    const keys = await redisClient.get("quickBite:*")
    if (keys.length) await redisClient.del(keys);
}


export const setFoodByIdCache = async (id, product) => {
    await redisClient.set(`
        quickBite:${id}`, 
        JSON.stringify(product), 
        "EX", 
        900);
};

export const getFoodByIdCache = async (id) => {
    const data = await redisClient.get(`quickBite:${id}`);
    return data ? JSON.parse(data) : null;
};

export const deleteFoodByIdCache = async (id) => {
    await redisClient.del(`quickBite:${id}`);
};
