import Queue from "../../lib/pkg/rabbitmq";
import Logger from "../../lib/logger";
import { MailService } from "../../api/services";
import { EmailMalfunctionTypes } from "../../typings/enums";

type QueueType = typeof Queue;

class EmailQueueWorker {
  private static _instance: EmailQueueWorker;
  private static _queue: QueueType = Queue;
  private static MailService = new MailService();

  static listen() {
    Logger.info("Email queue worker is listening for messages...");

    const qName = this._queue.emailQueue.queue;
    const retryQName = this._queue.emailQueue.retryQueue;
    const deadLetterQName = this._queue.emailQueue.deadLetterQueue;

    this._queue.channel.consume(qName, async (msg) => {
      if (msg) {
        Logger.info("Email queue worker received a new message.");
        const message = msg.content.toString();
        const content = JSON.parse(message);

        try {
          await this.MailService.sendMail(content);
          Logger.info("Successfully processed email message to " + content.to);
          this._queue.channel.ack(msg);
        } catch (e) {
          Logger.error("Error processing email message", e as Error);

          const retries = msg.properties.headers?.["x-retries"] || 0;
          if (retries >= 3) {
            this._queue.channel.publish(
              this._queue.emailQueue.exchange,
              this._queue.emailQueue.deadLetterRoutingKey,
              msg.content,
              { headers: { "x-retries": retries } },
            );
            this._queue.channel.ack(msg);
          } else {
            msg.properties.headers = {
              ...(msg.properties.headers || {}),
              "x-retries": retries + 1
            };
            this._queue.channel.nack(msg, false, false);
          }
          return;
        }
      }
    });
    this._queue.channel.consume(retryQName, async (msg) => {
      if (msg) {
        Logger.info("Email retry queue worker received a new message.");
        const message = msg.content.toString();
        const content = JSON.parse(message);

        Logger.info("Email message ready for retry: " + content.to);
      }
    });
    this._queue.channel.consume(deadLetterQName, async (msg) => {
      if (msg) {
        Logger.info("Email dead letter queue worker received a new message.");
        const message = msg.content.toString();
        const content = JSON.parse(message);

        try {
          await this.MailService.sendMail({
            to: "kayoluwalusi@gmail.com",
            type: EmailMalfunctionTypes.ERROR,
            message: `Failed to send email to ${content.to} after multiple attempts. Content: ${JSON.stringify(content)}`
          });
          Logger.info("Sent email alert for dead letter message regarding " + content.to);
          this._queue.channel.ack(msg);
        } catch (e) {
          Logger.error("Error sending email alert for dead letter message", e as Error);
        }
      }
    });
  }

  static addToQueue(data: any) {
    try {
      this._queue.channel.publish(
        this._queue.emailQueue.exchange,
        this._queue.emailQueue.routingKey,
        Buffer.from(JSON.stringify(data)),
        { headers: { "x-retries": 0 } }
      );
      Logger.info("Added new email job to the queue.");
    } catch (error) {
      Logger.error("Failed to add email job to the queue.", error as Error);
    }
  }
}

export default EmailQueueWorker;
