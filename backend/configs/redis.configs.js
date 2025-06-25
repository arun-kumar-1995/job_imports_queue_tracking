import redis from "redis";
export const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    connectTimeout: 10000,
    commandTimeout: 8000,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis client error", err);
  process.exit(1);
});

redisClient.on("ready", () => {
  const { host, port } = redisClient.options.socket;
  console.log(`Redis connected : ${host}:${port}`);
});

export const connectRedis = async () => {
  await redisClient.connect();
  await redisClient.ping();
};
