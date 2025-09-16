import ampq from "amqplib/callback_api";
import Logger from "../logger";

function connectQueue(callback: Function) {
  ampq.connect(process.env.RABBITMQ_URL as string, function (error, connection) {
    if (error) {
      Logger.error("Error in RabbitMQ connection", error);
      throw error;
    }
    callback(connection);
  });
}

export {
  connectQueue
};
