import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import {
  db,
  jobsTable,
  usersTable,
  applicationsTable,
  jobAlertsTable,
} from "@workspace/db";
import { and, desc, eq, sql, gte } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, loadCurrentUser, requireRole } from "../middlewares/auth";
import { createNotification, sendNotificationEmail } from "../lib/notifications";
import { addAdminSseClient, removeAdminSseClient, broadcastAdminEvent } from "../lib/adminSse";

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
    try {
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
    } catch (err) {
      res.status(500).json({ error: "Failed to load jobs" });
    }
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

router.get(
  "/admin/dashboard/stream",
  (req: Request, _res: Response, next: NextFunction) => {
    const token = req.query["token"] as string | undefined;
    if (token && !req.headers["authorization"]) {
      req.headers["authorization"] = `Bearer ${token}`;
    }
    next();
  },
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
    res.write(": connected\n\n");
    addAdminSseClient(res);
    const keepalive = setInterval(() => {
      try { res.write(": keepalive\n\n"); } catch { /* ignore */ }
    }, 25_000);
    req.on("close", () => {
      clearInterval(keepalive);
      removeAdminSseClient(res);
    });
  },
);

router.post(
  "/admin/jobs/:id/approve",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    await db
      .update(jobsTable)
      .set({ status: "approved", rejectionReason: null })
      .where(eq(jobsTable.id, id));
    const job = await getAdminJob(id);
    if (!job) { res.status(404).json({ error: "Not found" }); return; }
    await createNotification({
      userId: job.employerId,
      type: "job_approved",
      title: { ar: "تمت الموافقة على إعلانك", en: "Your job posting was approved" },
      body: {
        ar: `"${job.title}" أصبح مرئياً الآن للباحثين عن عمل.`,
        en: `"${job.title}" is now live and visible to job seekers.`,
      },
      link: `/jobs/${job.id}`,
    });
    // Notify matching job alert subscribers (in-app + email)
    try {
      const alerts = await db
        .select({
          userId: jobAlertsTable.userId,
          categories: jobAlertsTable.categories,
          types: jobAlertsTable.types,
          userEmail: usersTable.email,
          userName: usersTable.name,
        })
        .from(jobAlertsTable)
        .innerJoin(usersTable, eq(usersTable.id, jobAlertsTable.userId))
        .where(eq(jobAlertsTable.isActive, true));

      for (const alert of alerts) {
        if (alert.userId === job.employerId) continue;
        const catMatch = alert.categories.length === 0 || alert.categories.includes(job.category);
        const typeMatch = alert.types.length === 0 || alert.types.includes(job.type);
        if (catMatch && typeMatch) {
          await createNotification({
            userId: alert.userId,
            type: "new_job_alert",
            title: { ar: "وظيفة جديدة تناسبك", en: "New matching job posted" },
            body: { ar: `"${job.title}" في ${job.category}`, en: `"${job.title}" in ${job.category}` },
            link: `/jobs/${job.id}`,
          });
          // Send email notification
          if (alert.userEmail) {
            const appUrl = process.env["APP_URL"] ?? "https://fursa.replit.app";
            await sendNotificationEmail({
              to: alert.userEmail,
              subject: `فُرصة — وظيفة جديدة تناسبك: ${job.title}`,
              html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                  <h2 style="color: #2563eb;">🔔 وظيفة جديدة تناسبك</h2>
                  <p>مرحباً ${alert.userName}،</p>
                  <p>تم نشر وظيفة جديدة تتطابق مع تنبيهاتك:</p>
                  <div style="background: #f0f4ff; border-right: 4px solid #2563eb; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <h3 style="margin: 0 0 8px 0; color: #1e40af;">${job.title}</h3>
                    <p style="margin: 4px 0; color: #555;">📂 ${job.category}</p>
                    <p style="margin: 4px 0; color: #555;">🏢 ${job.employerName}</p>
                  </div>
                  <a href="${appUrl}/jobs/${job.id}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
                    عرض الوظيفة
                  </a>
                  <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; font-size: 12px;">
                    لإدارة تنبيهاتك، <a href="${appUrl}/seeker/alerts" style="color: #2563eb;">انقر هنا</a>
                  </p>
                </div>
              `,
            });
          }
        }
      }
    } catch { /* non-critical */ }
    broadcastAdminEvent("stats_changed", { action: "job_approved", jobId: id });
    res.json(serializeAdminJob(job));
  },
);

router.post(
  "/admin/jobs/:id/reject",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const parsed = rejectBodySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Rejection reason is required" }); return; }
    await db
      .update(jobsTable)
      .set({ status: "rejected", rejectionReason: parsed.data.reason })
      .where(eq(jobsTable.id, id));
    const job = await getAdminJob(id);
    if (!job) { res.status(404).json({ error: "Not found" }); return; }
    await createNotification({
      userId: job.employerId,
      type: "job_rejected",
      title: { ar: "تم رفض إعلانك", en: "Your job posting was rejected" },
      body: {
        ar: `"${job.title}" تم رفضه. السبب: ${parsed.data.reason}`,
        en: `"${job.title}" was rejected. Reason: ${parsed.data.reason}`,
      },
      link: `/employer/jobs`,
    });
    broadcastAdminEvent("stats_changed", { action: "job_rejected", jobId: id });
    res.json(serializeAdminJob(job));
  },
);

router.delete(
  "/admin/jobs/:id",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    await db.delete(jobsTable).where(eq(jobsTable.id, id));
    broadcastAdminEvent("stats_changed", { action: "job_deleted", jobId: id });
    res.status(204).end();
  },
);

router.get(
  "/admin/users",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    try {
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
          jobsCount: sql<number>`(select count(*)::int from "jobs" where "jobs"."employer_id" = "users"."id")`,
          applicationsCount: sql<number>`(select count(*)::int from "applications" where "applications"."applicant_id" = "users"."id")`,
          createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(usersTable.createdAt));
      res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
    } catch (err) {
      res.status(500).json({ error: "Failed to load users" });
    }
  },
);

router.post(
  "/admin/users/:id/toggle-active",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const id = String(req.params["id"] ?? "");
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    if (id === req.currentUser!.id) {
      res.status(400).json({ error: "You cannot disable your own account" });
      return;
    }
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    if (!existing[0]) { res.status(404).json({ error: "Not found" }); return; }

    const updated = await db
      .update(usersTable)
      .set({ isActive: !existing[0].isActive })
      .where(eq(usersTable.id, id))
      .returning();

    const u = updated[0]!;
    const counts = await db
      .select({
        jobs: sql<number>`(select count(*)::int from "jobs" where "jobs"."employer_id" = "users"."id")`,
        apps: sql<number>`(select count(*)::int from "applications" where "applications"."applicant_id" = "users"."id")`,
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
  "/admin/export/csv",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    try {
    const type = (req.query["type"] as string) || "users";

    if (type === "jobs") {
      const rows = await db
        .select({
          id: jobsTable.id,
          title: jobsTable.title,
          category: jobsTable.category,
          type: jobsTable.type,
          status: jobsTable.status,
          employerName: usersTable.name,
          employerEmail: usersTable.email,
          viewsCount: jobsTable.viewsCount,
          createdAt: jobsTable.createdAt,
        })
        .from(jobsTable)
        .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
        .orderBy(desc(jobsTable.createdAt));

      const header = "id,title,category,type,status,employer,employerEmail,views,createdAt\n";
      const csv =
        header +
        rows
          .map((r) =>
            [
              r.id,
              `"${r.title.replace(/"/g, '""')}"`,
              r.category,
              r.type,
              r.status,
              `"${r.employerName.replace(/"/g, '""')}"`,
              r.employerEmail,
              r.viewsCount,
              r.createdAt.toISOString(),
            ].join(","),
          )
          .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=jobs.csv");
      res.send(csv);
      return;
    }

    const rows = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        phone: usersTable.phone,
        location: usersTable.location,
        isActive: usersTable.isActive,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt));

    const header = "id,name,email,role,phone,location,isActive,createdAt\n";
    const csv =
      header +
      rows
        .map((r) =>
          [
            r.id,
            `"${r.name.replace(/"/g, '""')}"`,
            r.email,
            r.role,
            r.phone ?? "",
            r.location ?? "",
            r.isActive,
            r.createdAt.toISOString(),
          ].join(","),
        )
        .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=users.csv");
    res.send(csv);
    } catch (err) {
      res.status(500).json({ error: "Export failed" });
    }
  },
);

router.get(
  "/admin/analytics",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const days = Math.min(parseInt((req.query["days"] as string) || "30", 10) || 30, 90);
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const [jobsData, appsData, usersData] = await Promise.all([
        db.select({ day: sql<string>`date_trunc('day', ${jobsTable.createdAt})::date::text`, count: sql<number>`count(*)::int` })
          .from(jobsTable).where(gte(jobsTable.createdAt, since)).groupBy(sql`date_trunc('day', ${jobsTable.createdAt})`).orderBy(sql`date_trunc('day', ${jobsTable.createdAt})`),
        db.select({ day: sql<string>`date_trunc('day', ${applicationsTable.createdAt})::date::text`, count: sql<number>`count(*)::int` })
          .from(applicationsTable).where(gte(applicationsTable.createdAt, since)).groupBy(sql`date_trunc('day', ${applicationsTable.createdAt})`).orderBy(sql`date_trunc('day', ${applicationsTable.createdAt})`),
        db.select({ day: sql<string>`date_trunc('day', ${usersTable.createdAt})::date::text`, count: sql<number>`count(*)::int` })
          .from(usersTable).where(gte(usersTable.createdAt, since)).groupBy(sql`date_trunc('day', ${usersTable.createdAt})`).orderBy(sql`date_trunc('day', ${usersTable.createdAt})`),
      ]);
      res.json({ jobs: jobsData, applications: appsData, users: usersData });
    } catch { res.status(500).json({ error: "Failed to load analytics" }); }
  },
);

router.get(
  "/admin/dashboard",
  requireAuth,
  loadCurrentUser,
  requireRole("admin"),
  async (_req: Request, res: Response) => {
    try {
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

    let totalUsers = 0, seekers = 0, employers = 0;
    for (const r of users) {
      totalUsers += r.c;
      if (r.role === "seeker") seekers = r.c;
      else if (r.role === "employer") employers = r.c;
    }
    let totalJobs = 0, pending = 0, approved = 0, rejected = 0;
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
    } catch (err) {
      res.status(500).json({ error: "Failed to load dashboard data" });
    }
  },
);

export default router;
