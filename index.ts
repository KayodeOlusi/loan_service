import http from "http";
import app from "./src/api/app";
import DbBootstrap from "./src/db/bootstrap";
import * as EmailTransport from "./src/lib/transports/email";
import * as RedisConnection from "./src/lib/pkg/redis";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

DbBootstrap(() => {
  EmailTransport.testEmailConnection(EmailTransport.transporter);
  RedisConnection.testRedisConnection(RedisConnection.redis)();

  server.listen(PORT, () => {
    console.log("Server connection has been established successfully.", PORT);
  });
})
  .then()
  .catch()


