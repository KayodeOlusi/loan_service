import Queue from "../../lib/pkg/rabbitmq";
import Logger from "../../lib/logger";
import { MailService } from "../../api/services";

type QueueType = typeof Queue;

class EmailQueueWorker {
  private static _instance: EmailQueueWorker;
  private _queue: QueueType;

  constructor(queue: QueueType) {
    this._queue = queue;
  }

  static listen() {
    Logger.info("Email queue worker is listening for messages...");

    const qName = this.instance._queue.emailQueue.queue;
    const retryQName = this.instance._queue.emailQueue.retryQueue;
    const deadLetterQName = this.instance._queue.emailQueue.deadLetterQueue;

    this._instance._queue.channel.consume(qName, async function (msg) {
      if (msg) {
        Logger.info("Email queue worker received a new message.");
        const message = msg.content.toString();
        const content = JSON.parse(message);

        // TODO: process email sending
      }
    });
    this._instance._queue.channel.consume(retryQName, async function (msg) {
      if (msg) {
        Logger.info("Email retry queue worker received a new message.");
        const message = msg.content.toString();
        const content = JSON.parse(message);

        // TODO: process email sending retry
      }
    });
    this._instance._queue.channel.consume(deadLetterQName, async function (msg) {
      if (msg) {
        Logger.info("Email dead letter queue worker received a new message.");
        const message = msg.content.toString();
        const content = JSON.parse(message);

        // TODO: process dead letter email messages
      }
    });
  }

  static get instance() {
    if (!EmailQueueWorker._instance) {
      EmailQueueWorker._instance = new EmailQueueWorker(Queue);
    }
    return EmailQueueWorker._instance;
  }
}

export default EmailQueueWorker;
