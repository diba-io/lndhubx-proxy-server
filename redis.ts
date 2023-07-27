import { Redis } from "@upstash/redis";

const redisClient = () => {
  const client = new Redis({
    url: "",
    token: "",
  });

  return client;
};

export default redisClient;
