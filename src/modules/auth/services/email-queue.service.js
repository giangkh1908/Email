import redis from "../../../database/redis.js";
import { sendEmail } from "./email.service.js";
import { EMAIL_QUEUE_NAME, QUEUE_POLL_DELAY, QUEUE_RETRY_DELAY } from "../constants/queue.constants.js";

export const emailQueueService = {
  async enqueue({ to, subject, html }) {
    const task = JSON.stringify({ to, subject, html });
    await redis.lpush(EMAIL_QUEUE_NAME, task);
  },

  async processQueue() {
    console.log("📧 Email queue worker started");

    while (true) {
      const task = await redis.rpop(EMAIL_QUEUE_NAME);

      if (!task) {
        await new Promise((resolve) => setTimeout(resolve, QUEUE_POLL_DELAY));
        continue;
      }

      try {
        const { to, subject, html } = JSON.parse(task);
        await sendEmail({ to, subject, html });
        console.log(`✓ Email sent to ${to}`);
      } catch (error) {
        console.error(`✗ Failed to send email:`, error.message);
        await redis.lpush(EMAIL_QUEUE_NAME, task);
        await new Promise((resolve) => setTimeout(resolve, QUEUE_RETRY_DELAY));
      }
    }
  },
};
