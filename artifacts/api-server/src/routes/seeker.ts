import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  jobsTable,
  usersTable,
  applicationsTable,
  savedJobsTable,
} from "@workspace/db";
import { and, desc, eq, sql, ne } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, loadCurrentUser, requireRole } from "../middlewares/auth";
import { createNotification } from "../lib/notifications";

const router: IRouter = Router();

const applyBodySchema = z.object({
  coverLetter: z.string().nullable().optional(),
  cvObjectPath: z.string().nullable().optional(),
});

function serializeMyApp(row: {
  id: number;
  jobId: number;
  jobTitle: string;
  employerName: string;
  status: "pending" | "accepted" | "rejected";
  coverLetter: string | null;
  cvObjectPath: string | null;
  createdAt: Date;
}) {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

function serializePublicJob(row: {
  id: number;
  title: string;
  description: string;
  type: "online" | "field" | "hybrid";
  category: string;
  employerName: string;
  employerLocation: string | null;
  deadline: Date | null;
  createdAt: Date;
}) {
  return {
    ...row,
    deadline: row.deadline ? row.deadline.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  };
}

router.get(
  "/me/applications",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const rows = await db
      .select({
        id: applicationsTable.id,
        jobId: applicationsTable.jobId,
        jobTitle: jobsTable.title,
        employerName: usersTable.name,
        status: applicationsTable.status,
        coverLetter: applicationsTable.coverLetter,
        cvObjectPath: applicationsTable.cvObjectPath,
        createdAt: applicationsTable.createdAt,
      })
      .from(applicationsTable)
      .innerJoin(jobsTable, eq(jobsTable.id, applicationsTable.jobId))
      .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
      .where(eq(applicationsTable.applicantId, req.currentUser.id))
      .orderBy(desc(applicationsTable.createdAt));
    res.json(rows.map(serializeMyApp));
  },
);

router.get(
  "/me/saved-jobs",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const rows = await db
      .select({
        id: jobsTable.id,
        title: jobsTable.title,
        description: jobsTable.description,
        type: jobsTable.type,
        category: jobsTable.category,
        employerName: usersTable.name,
        employerLocation: usersTable.location,
        deadline: jobsTable.deadline,
        createdAt: jobsTable.createdAt,
      })
      .from(savedJobsTable)
      .innerJoin(jobsTable, eq(jobsTable.id, savedJobsTable.jobId))
      .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
      .where(
        and(
          eq(savedJobsTable.userId, req.currentUser.id),
          eq(jobsTable.status, "approved"),
        ),
      )
      .orderBy(desc(savedJobsTable.createdAt));
    res.json(rows.map(serializePublicJob));
  },
);

router.post(
  "/me/saved-jobs/:id",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    await db
      .insert(savedJobsTable)
      .values({ userId: req.currentUser.id, jobId: id })
      .onConflictDoNothing();
    res.status(204).end();
  },
);

router.delete(
  "/me/saved-jobs/:id",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    await db
      .delete(savedJobsTable)
      .where(
        and(
          eq(savedJobsTable.userId, req.currentUser.id),
          eq(savedJobsTable.jobId, id),
        ),
      );
    res.status(204).end();
  },
);

router.delete(
  "/me/applications/:id",
  requireAuth,
  loadCurrentUser,
  requireRole("seeker"),
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const application = await db
      .select()
      .from(applicationsTable)
      .where(
        and(
          eq(applicationsTable.id, id),
          eq(applicationsTable.applicantId, req.currentUser.id),
        ),
      )
      .limit(1);

    if (!application[0]) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    if (application[0].status !== "pending") {
      res.status(409).json({ error: "Cannot withdraw an application that has already been reviewed" });
      return;
    }

    await db
      .delete(applicationsTable)
      .where(eq(applicationsTable.id, id));

    res.status(204).end();
  },
);

router.post(
  "/jobs/:id/apply",
  requireAuth,
  loadCurrentUser,
  requireRole("seeker"),
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid job id" }); return; }
    const parsed = applyBodySchema.safeParse(req.body ?? {});
    if (!parsed.success) { res.status(400).json({ error: "Invalid application data" }); return; }

    const job = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.id, id))
      .limit(1);
    if (!job[0] || job[0].status !== "approved" || !job[0].isOpen) {
      res.status(404).json({ error: "Job not available" });
      return;
    }
    if (job[0].employerId === req.currentUser.id) {
      res.status(400).json({ error: "You cannot apply to your own job" });
      return;
    }

    const existing = await db
      .select({ id: applicationsTable.id })
      .from(applicationsTable)
      .where(
        and(
          eq(applicationsTable.applicantId, req.currentUser.id),
          eq(applicationsTable.jobId, id),
        ),
      )
      .limit(1);
    if (existing[0]) {
      res.status(409).json({ error: "You have already applied to this job" });
      return;
    }

    const cvPath =
      parsed.data.cvObjectPath ?? req.currentUser.cvObjectPath ?? null;

    const inserted = await db
      .insert(applicationsTable)
      .values({
        jobId: id,
        applicantId: req.currentUser.id,
        coverLetter: parsed.data.coverLetter ?? null,
        cvObjectPath: cvPath,
      })
      .returning();

    const employer = await db
      .select({ name: usersTable.name })
      .from(usersTable)
      .where(eq(usersTable.id, job[0].employerId))
      .limit(1);

    await createNotification({
      userId: job[0].employerId,
      type: "application_received",
      title: { ar: "طلب توظيف جديد", en: "New application received" },
      body: {
        ar: `${req.currentUser.name} تقدّم لوظيفتك: ${job[0].title}`,
        en: `${req.currentUser.name} applied to your job: ${job[0].title}`,
      },
      link: `/employer/jobs/${job[0].id}/applications`,
    });

    const a = inserted[0]!;
    res.status(201).json(
      serializeMyApp({
        id: a.id,
        jobId: a.jobId,
        jobTitle: job[0].title,
        employerName: employer[0]?.name ?? "",
        status: a.status,
        coverLetter: a.coverLetter,
        cvObjectPath: a.cvObjectPath,
        createdAt: a.createdAt,
      }),
    );
  },
);

router.get(
  "/me/dashboard",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const userId = req.currentUser.id;

    const [counts, savedCountRow, recent, recommended] = await Promise.all([
      db
        .select({
          status: applicationsTable.status,
          c: sql<number>`count(*)::int`,
        })
        .from(applicationsTable)
        .where(eq(applicationsTable.applicantId, userId))
        .groupBy(applicationsTable.status),
      db
        .select({ c: sql<number>`count(*)::int` })
        .from(savedJobsTable)
        .where(eq(savedJobsTable.userId, userId)),
      db
        .select({
          id: applicationsTable.id,
          jobId: applicationsTable.jobId,
          jobTitle: jobsTable.title,
          employerName: usersTable.name,
          status: applicationsTable.status,
          coverLetter: applicationsTable.coverLetter,
          cvObjectPath: applicationsTable.cvObjectPath,
          createdAt: applicationsTable.createdAt,
        })
        .from(applicationsTable)
        .innerJoin(jobsTable, eq(jobsTable.id, applicationsTable.jobId))
        .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
        .where(eq(applicationsTable.applicantId, userId))
        .orderBy(desc(applicationsTable.createdAt))
        .limit(5),
      db
        .select({
          id: jobsTable.id,
          title: jobsTable.title,
          description: jobsTable.description,
          type: jobsTable.type,
          category: jobsTable.category,
          employerName: usersTable.name,
          employerLocation: usersTable.location,
          deadline: jobsTable.deadline,
          createdAt: jobsTable.createdAt,
        })
        .from(jobsTable)
        .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
        .where(
          and(
            eq(jobsTable.status, "approved"),
            eq(jobsTable.isOpen, true),
            ne(jobsTable.employerId, userId),
          ),
        )
        .orderBy(desc(jobsTable.createdAt))
        .limit(6),
    ]);

    let pending = 0,
      accepted = 0,
      rejected = 0;
    let total = 0;
    for (const row of counts) {
      total += row.c;
      if (row.status === "pending") pending = row.c;
      else if (row.status === "accepted") accepted = row.c;
      else if (row.status === "rejected") rejected = row.c;
    }

    res.json({
      totalApplications: total,
      pendingApplications: pending,
      acceptedApplications: accepted,
      rejectedApplications: rejected,
      savedJobsCount: savedCountRow[0]?.c ?? 0,
      recentApplications: recent.map(serializeMyApp),
      recommendedJobs: recommended.map(serializePublicJob),
    });
  },
);

export default router;
