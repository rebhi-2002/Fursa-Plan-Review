import "./env";
import app from "./app";
import { logger } from "./lib/logger";
import { db, jobsTable } from "@workspace/db";
import { and, eq, lt } from "drizzle-orm";

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

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  closeExpiredJobs();
  setInterval(closeExpiredJobs, 60 * 60 * 1000);
});
