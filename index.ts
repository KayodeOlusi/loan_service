import http from "http";
import db from "./src/db";
import app from "./src/api/app";
import DbBootstrap from "./src/db/bootstrap";
import * as Migrations from "./src/db/migrate";
import * as RedisConnection from "./src/lib/pkg/redis";
import * as EmailTransport from "./src/lib/transports/email";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

DbBootstrap(async () => {
  await Migrations.runMigrations(db.sequelize)
  await RedisConnection.testRedisConnection(RedisConnection.redis)();
  EmailTransport.testEmailConnection(EmailTransport.transporter);

  server.listen(PORT, () => {
    console.log("Server connection has been established successfully.", PORT);
  });
})
  .then()
  .catch()


