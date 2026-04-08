import redis from "../../../database/redis.js";
import { sendEmail } from "./email.service.js";

const QUEUE_NAME = "email:queue";

export const emailQueueService = {
  async enqueue({ to, subject, html }) {
    const task = JSON.stringify({ to, subject, html });
    await redis.lpush(QUEUE_NAME, task);
  },

  async processQueue() {
    console.log("📧 Email queue worker started");

    while (true) {
      const task = await redis.rpop(QUEUE_NAME);

      if (!task) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      try {
        const { to, subject, html } = JSON.parse(task);
        await sendEmail({ to, subject, html });
        console.log(`✓ Email sent to ${to}`);
      } catch (error) {
        console.error(`✗ Failed to send email:`, error.message);
        await redis.lpush(QUEUE_NAME, task);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  },
};
