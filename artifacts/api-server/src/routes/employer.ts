import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  jobsTable,
  usersTable,
  applicationsTable,
} from "@workspace/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, loadCurrentUser, requireRole } from "../middlewares/auth";
import { createNotification } from "../lib/notifications";

const router: IRouter = Router();

const jobBodySchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  requirements: z.string().nullable().optional(),
  type: z.enum(["online", "field", "hybrid"]),
  category: z.string().min(1),
  contactInfo: z.string().min(1),
  deadline: z.string().datetime({ offset: true }).nullable().optional(),
});

const updateJobBodySchema = jobBodySchema.partial();

const updateAppStatusSchema = z.object({
  status: z.enum(["accepted", "rejected", "pending"]),
});

function isoOrNull(d: Date | null | undefined): string | null {
  return d ? d.toISOString() : null;
}

async function loadEmployerJob(jobId: number, employerId: string) {
  const rows = await db
    .select()
    .from(jobsTable)
    .where(and(eq(jobsTable.id, jobId), eq(jobsTable.employerId, employerId)))
    .limit(1);
  return rows[0] ?? null;
}

async function serializeEmployerJob(j: typeof jobsTable.$inferSelect) {
  const counts = await db
    .select({
      total: sql<number>`count(*)::int`,
      unseen: sql<number>`count(*) filter (where seen_by_employer = false)::int`,
    })
    .from(applicationsTable)
    .where(eq(applicationsTable.jobId, j.id));
  return {
    id: j.id,
    title: j.title,
    description: j.description,
    requirements: j.requirements,
    type: j.type,
    category: j.category,
    contactInfo: j.contactInfo,
    status: j.status,
    rejectionReason: j.rejectionReason,
    isOpen: j.isOpen,
    deadline: isoOrNull(j.deadline),
    applicationsCount: counts[0]?.total ?? 0,
    unseenApplicationsCount: counts[0]?.unseen ?? 0,
    createdAt: j.createdAt.toISOString(),
  };
}

router.get(
  "/employer/jobs",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const jobs = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.employerId, userId))
      .orderBy(desc(jobsTable.createdAt));
    const items = await Promise.all(jobs.map(serializeEmployerJob));
    res.json(items);
  },
);

router.post(
  "/employer/jobs",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    const parsed = jobBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid job data" });
      return;
    }
    const data = parsed.data;
    const inserted = await db
      .insert(jobsTable)
      .values({
        employerId: req.currentUser!.id,
        title: data.title,
        description: data.description,
        requirements: data.requirements ?? null,
        type: data.type,
        category: data.category,
        contactInfo: data.contactInfo,
        deadline: data.deadline ? new Date(data.deadline) : null,
        status: "pending",
        isOpen: true,
      })
      .returning();
    res.status(201).json(await serializeEmployerJob(inserted[0]!));
  },
);

router.get(
  "/employer/jobs/:id",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const job = await loadEmployerJob(id, req.currentUser!.id);
    if (!job) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await serializeEmployerJob(job));
  },
);

router.patch(
  "/employer/jobs/:id",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const parsed = updateJobBodySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid job data" }); return; }
    const job = await loadEmployerJob(id, req.currentUser!.id);
    if (!job) { res.status(404).json({ error: "Not found" }); return; }

    const updates: Record<string, unknown> = {};
    let resetToPending = false;
    for (const [k, v] of Object.entries(parsed.data)) {
      if (v === undefined) continue;
      if (k === "deadline") {
        updates["deadline"] = v ? new Date(v as string) : null;
      } else {
        updates[k] = v;
      }
      if (
        ["title", "description", "requirements", "category", "type"].includes(k)
      ) {
        resetToPending = true;
      }
    }
    if (resetToPending && job.status !== "pending") {
      updates["status"] = "pending";
      updates["rejectionReason"] = null;
    }

    const updated = await db
      .update(jobsTable)
      .set(updates)
      .where(eq(jobsTable.id, id))
      .returning();
    res.json(await serializeEmployerJob(updated[0]!));
  },
);

router.delete(
  "/employer/jobs/:id",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const job = await loadEmployerJob(id, req.currentUser!.id);
    if (!job) { res.status(404).json({ error: "Not found" }); return; }
    await db.delete(jobsTable).where(eq(jobsTable.id, id));
    res.status(204).end();
  },
);

router.post(
  "/employer/jobs/:id/toggle-open",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const job = await loadEmployerJob(id, req.currentUser!.id);
    if (!job) { res.status(404).json({ error: "Not found" }); return; }
    const updated = await db
      .update(jobsTable)
      .set({ isOpen: !job.isOpen })
      .where(eq(jobsTable.id, id))
      .returning();
    res.json(await serializeEmployerJob(updated[0]!));
  },
);

router.get(
  "/employer/jobs/:id/applications",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const job = await loadEmployerJob(id, req.currentUser!.id);
    if (!job) { res.status(404).json({ error: "Not found" }); return; }

    const rows = await db
      .select({
        id: applicationsTable.id,
        jobId: applicationsTable.jobId,
        applicantName: usersTable.name,
        applicantEmail: usersTable.email,
        applicantPhone: usersTable.phone,
        applicantLocation: usersTable.location,
        applicantBio: usersTable.bio,
        coverLetter: applicationsTable.coverLetter,
        cvObjectPath: applicationsTable.cvObjectPath,
        status: applicationsTable.status,
        seenByEmployer: applicationsTable.seenByEmployer,
        createdAt: applicationsTable.createdAt,
      })
      .from(applicationsTable)
      .innerJoin(usersTable, eq(usersTable.id, applicationsTable.applicantId))
      .where(eq(applicationsTable.jobId, id))
      .orderBy(desc(applicationsTable.createdAt));
    res.json(
      rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    );
  },
);

router.patch(
  "/employer/applications/:id",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const parsed = updateAppStatusSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid status" }); return; }

    const rows = await db
      .select({
        app: applicationsTable,
        applicant: usersTable,
        job: jobsTable,
      })
      .from(applicationsTable)
      .innerJoin(usersTable, eq(usersTable.id, applicationsTable.applicantId))
      .innerJoin(jobsTable, eq(jobsTable.id, applicationsTable.jobId))
      .where(eq(applicationsTable.id, id))
      .limit(1);
    const row = rows[0];
    if (!row || row.job.employerId !== req.currentUser!.id) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const updated = await db
      .update(applicationsTable)
      .set({ status: parsed.data.status, seenByEmployer: true })
      .where(eq(applicationsTable.id, id))
      .returning();
    const a = updated[0]!;

    if (parsed.data.status === "accepted" || parsed.data.status === "rejected") {
      await createNotification({
        userId: row.applicant.id,
        type:
          parsed.data.status === "accepted"
            ? "application_accepted"
            : "application_rejected",
        title:
          parsed.data.status === "accepted"
            ? "Your application was accepted"
            : "Your application was not selected",
        body:
          parsed.data.status === "accepted"
            ? `Congratulations — ${row.job.title} accepted your application.`
            : `${row.job.title}: the employer chose another candidate this time.`,
        link: "/seeker/applications",
      });
    }
    res.json({
      id: a.id,
      jobId: a.jobId,
      applicantName: row.applicant.name,
      applicantEmail: row.applicant.email,
      applicantPhone: row.applicant.phone,
      applicantLocation: row.applicant.location,
      applicantBio: row.applicant.bio,
      coverLetter: a.coverLetter,
      cvObjectPath: a.cvObjectPath,
      status: a.status,
      seenByEmployer: a.seenByEmployer,
      createdAt: a.createdAt.toISOString(),
    });
  },
);

router.post(
  "/employer/applications/:id/seen",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const rows = await db
      .select({ app: applicationsTable, job: jobsTable })
      .from(applicationsTable)
      .innerJoin(jobsTable, eq(jobsTable.id, applicationsTable.jobId))
      .where(eq(applicationsTable.id, id))
      .limit(1);
    const row = rows[0];
    if (!row || row.job.employerId !== req.currentUser!.id) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    await db
      .update(applicationsTable)
      .set({ seenByEmployer: true })
      .where(eq(applicationsTable.id, id));
    res.status(204).end();
  },
);

router.get(
  "/employer/dashboard",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const [statusCounts, appCounts, recent, topJobs] = await Promise.all([
      db
        .select({
          status: jobsTable.status,
          c: sql<number>`count(*)::int`,
        })
        .from(jobsTable)
        .where(eq(jobsTable.employerId, userId))
        .groupBy(jobsTable.status),
      db
        .select({
          total: sql<number>`count(*)::int`,
          unseen: sql<number>`count(*) filter (where ${applicationsTable.seenByEmployer} = false)::int`,
        })
        .from(applicationsTable)
        .innerJoin(jobsTable, eq(jobsTable.id, applicationsTable.jobId))
        .where(eq(jobsTable.employerId, userId)),
      db
        .select({
          id: applicationsTable.id,
          jobId: applicationsTable.jobId,
          applicantName: usersTable.name,
          applicantEmail: usersTable.email,
          applicantPhone: usersTable.phone,
          applicantLocation: usersTable.location,
          applicantBio: usersTable.bio,
          coverLetter: applicationsTable.coverLetter,
          cvObjectPath: applicationsTable.cvObjectPath,
          status: applicationsTable.status,
          seenByEmployer: applicationsTable.seenByEmployer,
          createdAt: applicationsTable.createdAt,
        })
        .from(applicationsTable)
        .innerJoin(jobsTable, eq(jobsTable.id, applicationsTable.jobId))
        .innerJoin(usersTable, eq(usersTable.id, applicationsTable.applicantId))
        .where(eq(jobsTable.employerId, userId))
        .orderBy(desc(applicationsTable.createdAt))
        .limit(5),
      db
        .select()
        .from(jobsTable)
        .where(eq(jobsTable.employerId, userId))
        .orderBy(desc(jobsTable.createdAt))
        .limit(5),
    ]);

    let approved = 0,
      pending = 0,
      rejected = 0,
      total = 0;
    for (const row of statusCounts) {
      total += row.c;
      if (row.status === "approved") approved = row.c;
      else if (row.status === "pending") pending = row.c;
      else if (row.status === "rejected") rejected = row.c;
    }

    const top = await Promise.all(topJobs.map(serializeEmployerJob));
    res.json({
      totalJobs: total,
      approvedJobs: approved,
      pendingJobs: pending,
      rejectedJobs: rejected,
      totalApplications: appCounts[0]?.total ?? 0,
      unseenApplications: appCounts[0]?.unseen ?? 0,
      recentApplications: recent.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
      topJobs: top,
    });
  },
);

export default router;
