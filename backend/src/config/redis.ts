import Redis from "ioredis";
import env from "./env";

const redis = new Redis({
    host: env.REDIS_HOST || "127.0.0.1",
    port: Number(env.REDIS_PORT) || 6379,
    password: env.REDIS_PASSWORD || undefined,
});

redis.on("connect", () => console.log("✅ Redis Connected"));
redis.on("error", (err) => console.error("❌ Redis Error: ", err));

export default redis;
