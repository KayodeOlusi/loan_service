import Logger from "../logger";
import ampq, { Channel, Connection } from "amqplib/callback_api";

class Queue {
  private static _connection: Connection;
  private static _channel: Channel;

  private static variables = {
    email: {
      queue: "loan_service_email_queue",
      exchange: "loan_service_email_queue_exchange",
      routingKey: "loan_service_email_routing_key",
      retryQueue: "loan_service_email_queue_retry",
      retryRoutingKey: "loan_service_email_routing_key_retry",
      deadLetterQueue: "loan_service_email_queue_dead_letter",
      deadLetterRoutingKey: "loan_service_email_routing_key_dead_letter"
    }
  }

  static connect(callback?: Function) {
    if (this._connection) {
      Logger.info("RabbitMQ connection already established!");
      if (this._channel) return callback?.(this._connection);
    }

    ampq.connect(process.env.RABBITMQ_URL as string, (error, connection) => {
      if (error) {
        Logger.error("Error in RabbitMQ connection", error);
        throw error;
      }

      Logger.info("Connected to the RabbitMQ server");
      this._connection = connection;
      this.createNewChannel(connection, callback);
    });
  }

  private static createNewChannel(connection: Connection, callback?: Function) {
    connection.createChannel((err, channel) => {
      if (err) {
        Logger.error("Error in creating channel", err);
        throw err;
      }

      this._channel = channel;
      this.initializeEmailQueue();

      callback?.(this._connection);
    });
  }

  static get connection() {
    return this._connection;
  }

  static get channel() {
    return this._channel;
  }

  static get emailQueue() {
    return this.variables.email;
  }

  static initializeEmailQueue() {
    if (!this._channel) {
      throw new Error("Channel is not created yet!");
    }

    const data = this.variables.email;
    try {
      this._channel.assertExchange(data.exchange, "direct", { durable: true });

      this._channel.assertQueue(data.queue, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": data.exchange,
          "x-dead-letter-routing-key": data.retryRoutingKey
        }
      });
      this._channel.assertQueue(data.retryQueue, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": data.exchange,
          "x-message-ttl": 60000,
          "x-dead-letter-routing-key": data.routingKey
        }
      });
      this._channel.assertQueue(data.deadLetterQueue, {
        durable: true
      });

      this._channel.bindQueue(data.queue, data.exchange, data.routingKey);
      this._channel.bindQueue(data.retryQueue, data.exchange, data.retryRoutingKey);
      this._channel.bindQueue(data.deadLetterQueue, data.exchange, data.deadLetterRoutingKey);

      Logger.info("Email queue initialized successfully");
    } catch (e) {
      Logger.error("Error in initializing email queue", e as Error);
    }
  }

  static get instance() {
    if (!this._connection) {
      throw new Error("RabbitMQ is not connected yet. Please call connect() first.");
    }
    if (!this._channel) {
      throw new Error("Channel is not created yet. Please wait for the channel to be created.");
    }
    return this;
  }
}

export default Queue;
