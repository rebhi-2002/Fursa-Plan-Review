import { Router, type IRouter, type Request, type Response } from "express";
import { db, jobsTable, usersTable, applicationsTable } from "@workspace/db";
import { eq, sql, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/platform/stats", async (_req: Request, res: Response) => {
  try {
    const [jobs, employers, seekers, apps] = await Promise.all([
      db.select({ c: sql<number>`count(*)::int` }).from(jobsTable).where(eq(jobsTable.status, "approved")),
      db.select({ c: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.role, "employer")),
      db.select({ c: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.role, "seeker")),
      db.select({ c: sql<number>`count(*)::int` }).from(applicationsTable),
    ]);
    res.json({
      totalJobs: jobs[0]?.c ?? 0,
      totalEmployers: employers[0]?.c ?? 0,
      totalSeekers: seekers[0]?.c ?? 0,
      totalApplications: apps[0]?.c ?? 0,
    });
  } catch {
    res.json({ totalJobs: 0, totalEmployers: 0, totalSeekers: 0, totalApplications: 0 });
  }
});

router.get("/platform/categories", async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select({ category: jobsTable.category, count: sql<number>`count(*)::int` })
      .from(jobsTable)
      .where(and(eq(jobsTable.status, "approved"), eq(jobsTable.isOpen, true)))
      .groupBy(jobsTable.category)
      .orderBy(sql`count(*) desc`);
    res.json(rows);
  } catch {
    res.json([]);
  }
});

export default router;
