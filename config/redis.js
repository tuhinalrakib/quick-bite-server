import dotenv from "dotenv"
import Redis from "ioredis"
import logger from "../utils/logger.js"

dotenv.config()

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  // tls: true,
  retryStrategy(times) {
    logger.warn(`🔁 Redis reconnecting... attempt #${times}`);
    return Math.min(times * 200, 2000);
  },
});

redisClient.on("connect", () => logger.info("✅ Connected to Redis Cloud"));
redisClient.on("ready", () => logger.info("🚀 Redis connection ready"));
redisClient.on("error", (err) => logger.error(`❌ Redis Error: ${err}`));
redisClient.on("close", () => logger.warn("⚠️ Redis connection closed"));

// optional test
(async () => {
  try {
    await redisClient.set("foo", "bar");
    const result = await redisClient.get("foo");
    logger.info(`Redis test result: ${result}`);
  } catch (err) {
    logger.error(`Redis test failed: ${err.message}`);
  }
})();


export default redisClient;