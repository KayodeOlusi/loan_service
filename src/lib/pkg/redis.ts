import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

function testRedisConnection(client: typeof redis) {
  return async function () {
    try {
      await client.connect();
      console.log("Redis connection has been established successfully.");
    } catch (e) {
      await client.disconnect();
      console.log(e, "Error in Redis connection");
    }
  }
}

export {
  redis,
  testRedisConnection
}
