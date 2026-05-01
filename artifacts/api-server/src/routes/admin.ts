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

const rejectBodySchema = z.object({ reason: z.string().min(2) });

function serializeAdminJob(j: {
  id: number;
  title: string;
  description: string;
  requirements: string | null;
  type: "online" | "field" | "hybrid";
  category: string;
  contactInfo: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  employerId: string;
  employerName: string;
  employerEmail: string;
  createdAt: Date;
}) {
  return { ...j, createdAt: j.createdAt.toISOString() };
}

router.get(
  "/admin/jobs",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const status = req.query["status"] as string | undefined;
    const conditions =
      status === "pending" || status === "approved" || status === "rejected"
        ? [eq(jobsTable.status, status)]
        : [];
    const rows = await db
      .select({
        id: jobsTable.id,
        title: jobsTable.title,
        description: jobsTable.description,
        requirements: jobsTable.requirements,
        type: jobsTable.type,
        category: jobsTable.category,
        contactInfo: jobsTable.contactInfo,
        status: jobsTable.status,
        rejectionReason: jobsTable.rejectionReason,
        employerId: usersTable.id,
        employerName: usersTable.name,
        employerEmail: usersTable.email,
        createdAt: jobsTable.createdAt,
      })
      .from(jobsTable)
      .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(jobsTable.createdAt));
    res.json(rows.map(serializeAdminJob));
  },
);

async function getAdminJob(id: number) {
  const rows = await db
    .select({
      id: jobsTable.id,
      title: jobsTable.title,
      description: jobsTable.description,
      requirements: jobsTable.requirements,
      type: jobsTable.type,
      category: jobsTable.category,
      contactInfo: jobsTable.contactInfo,
      status: jobsTable.status,
      rejectionReason: jobsTable.rejectionReason,
      employerId: usersTable.id,
      employerName: usersTable.name,
      employerEmail: usersTable.email,
      createdAt: jobsTable.createdAt,
    })
    .from(jobsTable)
    .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
    .where(eq(jobsTable.id, id))
    .limit(1);
  return rows[0] ?? null;
}

router.post(
  "/admin/jobs/:id/approve",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const id = parseInt(req.params["id"] ?? "");
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });
    await db
      .update(jobsTable)
      .set({ status: "approved", rejectionReason: null })
      .where(eq(jobsTable.id, id));
    const job = await getAdminJob(id);
    if (!job) return res.status(404).json({ error: "Not found" });
    await createNotification({
      userId: job.employerId,
      type: "job_approved",
      title: "Your job posting was approved",
      body: `"${job.title}" is now live and visible to job seekers.`,
      link: `/jobs/${job.id}`,
    });
    res.json(serializeAdminJob(job));
  },
);

router.post(
  "/admin/jobs/:id/reject",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const id = parseInt(req.params["id"] ?? "");
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });
    const parsed = rejectBodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Rejection reason is required" });
    await db
      .update(jobsTable)
      .set({ status: "rejected", rejectionReason: parsed.data.reason })
      .where(eq(jobsTable.id, id));
    const job = await getAdminJob(id);
    if (!job) return res.status(404).json({ error: "Not found" });
    await createNotification({
      userId: job.employerId,
      type: "job_rejected",
      title: "Your job posting was rejected",
      body: `"${job.title}" was rejected. Reason: ${parsed.data.reason}`,
      link: `/employer/jobs`,
    });
    res.json(serializeAdminJob(job));
  },
);

router.delete(
  "/admin/jobs/:id",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const id = parseInt(req.params["id"] ?? "");
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });
    await db.delete(jobsTable).where(eq(jobsTable.id, id));
    res.status(204).end();
  },
);

router.get(
  "/admin/users",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const role = req.query["role"] as string | undefined;
    const conditions =
      role === "seeker" || role === "employer" || role === "admin"
        ? [eq(usersTable.role, role)]
        : [];

    const rows = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        phone: usersTable.phone,
        location: usersTable.location,
        isActive: usersTable.isActive,
        jobsCount: sql<number>`(select count(*)::int from ${jobsTable} where ${jobsTable.employerId} = ${usersTable.id})`,
        applicationsCount: sql<number>`(select count(*)::int from ${applicationsTable} where ${applicationsTable.applicantId} = ${usersTable.id})`,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(usersTable.createdAt));

    res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
  },
);

router.post(
  "/admin/users/:id/toggle-active",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const id = req.params["id"];
    if (!id) return res.status(400).json({ error: "Invalid id" });
    if (id === req.currentUser!.id) {
      return res.status(400).json({ error: "You cannot disable your own account" });
    }
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    if (!existing[0]) return res.status(404).json({ error: "Not found" });

    const updated = await db
      .update(usersTable)
      .set({ isActive: !existing[0].isActive })
      .where(eq(usersTable.id, id))
      .returning();

    const u = updated[0]!;
    const counts = await db
      .select({
        jobs: sql<number>`(select count(*)::int from ${jobsTable} where ${jobsTable.employerId} = ${u.id})`,
        apps: sql<number>`(select count(*)::int from ${applicationsTable} where ${applicationsTable.applicantId} = ${u.id})`,
      })
      .from(usersTable)
      .where(eq(usersTable.id, u.id))
      .limit(1);
    res.json({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      location: u.location,
      isActive: u.isActive,
      jobsCount: counts[0]?.jobs ?? 0,
      applicationsCount: counts[0]?.apps ?? 0,
      createdAt: u.createdAt.toISOString(),
    });
  },
);

router.get(
  "/admin/dashboard",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (_req: Request, res: Response) => {
    const [users, jobs, totalApps, recentPending] = await Promise.all([
      db
        .select({ role: usersTable.role, c: sql<number>`count(*)::int` })
        .from(usersTable)
        .groupBy(usersTable.role),
      db
        .select({ status: jobsTable.status, c: sql<number>`count(*)::int` })
        .from(jobsTable)
        .groupBy(jobsTable.status),
      db.select({ c: sql<number>`count(*)::int` }).from(applicationsTable),
      db
        .select({
          id: jobsTable.id,
          title: jobsTable.title,
          description: jobsTable.description,
          requirements: jobsTable.requirements,
          type: jobsTable.type,
          category: jobsTable.category,
          contactInfo: jobsTable.contactInfo,
          status: jobsTable.status,
          rejectionReason: jobsTable.rejectionReason,
          employerId: usersTable.id,
          employerName: usersTable.name,
          employerEmail: usersTable.email,
          createdAt: jobsTable.createdAt,
        })
        .from(jobsTable)
        .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
        .where(eq(jobsTable.status, "pending"))
        .orderBy(desc(jobsTable.createdAt))
        .limit(8),
    ]);

    let totalUsers = 0,
      seekers = 0,
      employers = 0;
    for (const r of users) {
      totalUsers += r.c;
      if (r.role === "seeker") seekers = r.c;
      else if (r.role === "employer") employers = r.c;
    }
    let totalJobs = 0,
      pending = 0,
      approved = 0,
      rejected = 0;
    for (const r of jobs) {
      totalJobs += r.c;
      if (r.status === "pending") pending = r.c;
      else if (r.status === "approved") approved = r.c;
      else if (r.status === "rejected") rejected = r.c;
    }

    res.json({
      totalUsers,
      totalSeekers: seekers,
      totalEmployers: employers,
      totalJobs,
      pendingJobs: pending,
      approvedJobs: approved,
      rejectedJobs: rejected,
      totalApplications: totalApps[0]?.c ?? 0,
      recentPendingJobs: recentPending.map(serializeAdminJob),
    });
  },
);

export default router;
