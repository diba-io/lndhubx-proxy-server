import { createClient } from "redis";

const redisClient = () => {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("error", (err) => {
    console.log("Redis error: ", err);
  });

  return client;
};

export default redisClient;
