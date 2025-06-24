import redis from "redis";
export const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.error("Redis client error", err);
  process.exit(1);
});

redisClient.on("ready", () => {
  console.log("Redis Connect");
});

export const connectRedis = async () => {
  await redisClient.connect();
  await redisClient.ping();
};
