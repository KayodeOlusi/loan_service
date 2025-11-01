import http from "http";
import app from "./api/app";
import DbBootstrap from "./db/bootstrap";
import * as RedisConnection from "./lib/pkg/redis";
import * as EmailTransport from "./lib/transports/email";
import Queue from "./lib/pkg/rabbitmq";
import EmailQueueWorker from "./utils/workers/email-queue.worker";
import Logger from "./lib/logger";

const PORT = process.env.PORT ?? 8000;
const server = http.createServer(app);

function shutdown() {
  Logger.info("Shutting down server...");
  server.close(function () {
    Logger.info("Shutting down server...");
    process.exit(0);
  });
}

DbBootstrap()
  .then(function () {
    RedisConnection.testRedisConnection(RedisConnection.redis)();
    EmailTransport.testEmailConnection(EmailTransport.transporter);
    Queue.connect(function ()  {
      EmailQueueWorker.listen();
    });

    server.listen(PORT, () => {
      console.log("Server connection has been established successfully.", PORT);
    });

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  })
  .catch(function (err) {
    Logger.error("Failed to bootstrap database", err);
    process.exit(1);
  })


