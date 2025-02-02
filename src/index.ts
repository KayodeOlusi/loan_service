import http from "http";
import app from "./api/app";
import DbBootstrap from "./db/bootstrap";
import * as RedisConnection from "./lib/pkg/redis";
import * as EmailTransport from "./lib/transports/email";

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

DbBootstrap(async () => {
  await RedisConnection.testRedisConnection(RedisConnection.redis)();
  EmailTransport.testEmailConnection(EmailTransport.transporter);

  server.listen(PORT, () => {
    console.log("Server connection has been established successfully.", PORT);
  });
})
  .then()
  .catch()


