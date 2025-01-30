import { createClient } from "redis";
import Logger from "../logger";

const redis = createClient({
  url: process.env.REDIS_URL,
});

function testRedisConnection(client: typeof redis) {
  return async function () {
    try {
      await client.connect();
      Logger.info("Redis connection has been established successfully.");
    } catch (e) {
      await client.disconnect();
      Logger.error("Error in Redis connection", e as Error);
    }
  }
}

export {
  redis,
  testRedisConnection
}
