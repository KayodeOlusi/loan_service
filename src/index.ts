import http from "http";
import app from "./api/app";
import DbBootstrap from "./db/bootstrap";
import * as RedisConnection from "./lib/pkg/redis";
import * as EmailTransport from "./lib/transports/email";
import Queue from "./lib/pkg/rabbitmq";
import EmailQueueWorker from "./utils/workers/email-queue.worker";

const PORT = process.env.PORT ?? 8000;
const server = http.createServer(app);

DbBootstrap(async () => {
  await RedisConnection.testRedisConnection(RedisConnection.redis)();
  EmailTransport.testEmailConnection(EmailTransport.transporter);
  Queue.connect(function ()  {
    EmailQueueWorker.listen();
  });

  server.listen(PORT, () => {
    console.log("Server connection has been established successfully.", PORT);
  });
})
  .then()
  .catch()


