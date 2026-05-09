import "./env";
import app from "./app";
import { logger } from "./lib/logger";
import { db, jobsTable, usersTable } from "@workspace/db";
import { and, eq, gte, lt, lte } from "drizzle-orm";
import { createNotification } from "./lib/notifications";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function closeExpiredJobs() {
  try {
    const now = new Date();
    const result = await db
      .update(jobsTable)
      .set({ isOpen: false })
      .where(
        and(
          eq(jobsTable.isOpen, true),
          eq(jobsTable.status, "approved"),
          lt(jobsTable.deadline, now),
        ),
      )
      .returning({ id: jobsTable.id });
    if (result.length > 0) {
      logger.info({ count: result.length }, "Auto-closed expired jobs");
    }
  } catch (err) {
    logger.error({ err }, "Error auto-closing expired jobs");
  }
}

async function notifyExpiringJobs() {
  try {
    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const in4Days = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

    const expiring = await db
      .select({
        id: jobsTable.id,
        title: jobsTable.title,
        deadline: jobsTable.deadline,
        employerId: jobsTable.employerId,
      })
      .from(jobsTable)
      .where(
        and(
          eq(jobsTable.isOpen, true),
          eq(jobsTable.status, "approved"),
          gte(jobsTable.deadline, in3Days),
          lte(jobsTable.deadline, in4Days),
        ),
      );

    for (const job of expiring) {
      await createNotification({
        userId: job.employerId,
        type: "new_job_alert",
        title: {
          ar: `⚠️ وظيفتك على وشك الانتهاء: ${job.title}`,
          en: `⚠️ Job Expiring Soon: ${job.title}`,
        },
        body: {
          ar: `وظيفتك "${job.title}" ستنتهي خلال 3 أيام. يمكنك تمديدها من لوحة التحكم.`,
          en: `Your job "${job.title}" will expire in 3 days. You can extend it from your dashboard.`,
        },
        link: `/employer/jobs/${job.id}`,
      });
    }

    if (expiring.length > 0) {
      logger.info({ count: expiring.length }, "Sent job-expiry notifications");
    }
  } catch (err) {
    logger.error({ err }, "Error sending job-expiry notifications");
  }
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  closeExpiredJobs();
  setInterval(closeExpiredJobs, 60 * 60 * 1000);

  notifyExpiringJobs();
  setInterval(notifyExpiringJobs, 6 * 60 * 60 * 1000);
});
