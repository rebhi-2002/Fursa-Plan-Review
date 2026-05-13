import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  jobsTable,
  usersTable,
  applicationsTable,
  messagesTable,
} from "@workspace/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, loadCurrentUser, requireRole } from "../middlewares/auth";
import { createNotification } from "../lib/notifications";
import { broadcastAdminEvent } from "../lib/adminSse";

const router: IRouter = Router();

const jobBodySchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  requirements: z.string().nullable().optional(),
  type: z.enum(["online", "field", "hybrid"]),
  category: z.string().min(1),
  contactInfo: z.string().min(1),
  deadline: z.string().datetime({ offset: true }).nullable().optional(),
  tags: z.string().nullable().optional(),
  salaryMin: z.number().int().min(0).nullable().optional(),
  salaryMax: z.number().int().min(0).nullable().optional(),
  salaryCurrency: z.string().max(10).nullable().optional(),
});

const updateJobBodySchema = jobBodySchema.partial();

const updateAppStatusSchema = z.object({
  status: z.enum(["accepted", "rejected", "pending"]),
  rejectionNote: z.string().max(1000).nullable().optional(),
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
    tags: j.tags ?? null,
    salaryMin: j.salaryMin ?? null,
    salaryMax: j.salaryMax ?? null,
    salaryCurrency: j.salaryCurrency ?? "USD",
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
        tags: data.tags ?? null,
        salaryMin: data.salaryMin ?? null,
        salaryMax: data.salaryMax ?? null,
        salaryCurrency: data.salaryCurrency ?? "USD",
        status: "pending",
        isOpen: true,
      })
      .returning();
    const newJob = inserted[0]!;
    broadcastAdminEvent("new_job_pending", {
      id: newJob.id,
      title: newJob.title,
      category: newJob.category,
      type: newJob.type,
      employerName: req.currentUser!.name,
    });
    res.status(201).json(await serializeEmployerJob(newJob));
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
        applicantId: usersTable.id,
        applicantName: usersTable.name,
        applicantEmail: usersTable.email,
        applicantPhone: usersTable.phone,
        applicantLocation: usersTable.location,
        applicantBio: usersTable.bio,
        coverLetter: applicationsTable.coverLetter,
        cvObjectPath: applicationsTable.cvObjectPath,
        status: applicationsTable.status,
        rejectionNote: applicationsTable.rejectionNote,
        seenByEmployer: applicationsTable.seenByEmployer,
        createdAt: applicationsTable.createdAt,
      })
      .from(applicationsTable)
      .innerJoin(usersTable, eq(usersTable.id, applicationsTable.applicantId))
      .where(eq(applicationsTable.jobId, id))
      .orderBy(desc(applicationsTable.createdAt));
    res.json(
      rows.map((r) => ({ ...r, rejectionNote: r.rejectionNote ?? null, createdAt: r.createdAt.toISOString() })),
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
      .set({
        status: parsed.data.status,
        seenByEmployer: true,
        rejectionNote: parsed.data.status === "rejected" ? (parsed.data.rejectionNote ?? null) : null,
      })
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
            ? { ar: "تم قبول طلبك", en: "Your application was accepted" }
            : { ar: "لم يتم اختيار طلبك", en: "Your application was not selected" },
        body:
          parsed.data.status === "accepted"
            ? {
                ar: `تهانينا — تم قبولك في وظيفة: ${row.job.title}`,
                en: `Congratulations — ${row.job.title} accepted your application.`,
              }
            : {
                ar: `${row.job.title}: اختار صاحب العمل مرشحاً آخر هذه المرة.`,
                en: `${row.job.title}: the employer chose another candidate this time.`,
              },
        link: "/seeker/applications",
      });
    }
    res.json({
      id: a.id,
      jobId: a.jobId,
      applicantId: row.applicant.id,
      applicantName: row.applicant.name,
      applicantEmail: row.applicant.email,
      applicantPhone: row.applicant.phone,
      applicantLocation: row.applicant.location,
      applicantBio: row.applicant.bio,
      coverLetter: a.coverLetter,
      cvObjectPath: a.cvObjectPath,
      status: a.status,
      rejectionNote: a.rejectionNote ?? null,
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

router.get(
  "/employer/jobs/:id/suggested-candidates",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const job = await loadEmployerJob(id, req.currentUser.id);
    if (!job) { res.status(404).json({ error: "Not found" }); return; }

    const category = (job.category || "").toLowerCase();
    const titleWords = job.title
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const seekers = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        bio: usersTable.bio,
        location: usersTable.location,
      })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.role, "seeker"),
          eq(usersTable.isActive, true),
          eq(usersTable.onboarded, true),
        ),
      )
      .limit(200);

    type SeekerWithScore = {
      id: string;
      name: string;
      bio: string | null;
      location: string | null;
      score: number;
    };

    const scored: SeekerWithScore[] = seekers
      .map((seeker) => {
        let score = 0;
        const bio = (seeker.bio ?? "").toLowerCase();
        if (category && bio.includes(category)) score += 3;
        for (const word of titleWords) {
          if (bio.includes(word)) {
            score += 2;
            break;
          }
        }
        return { ...seeker, score };
      })
      .filter((s) => s.score > 0);

    scored.sort((a, b) => b.score - a.score);

    res.json(
      scored.slice(0, 8).map(({ score: _s, ...s }) => s),
    );
  },
);

router.post(
  "/employer/jobs/:jobId/invite/:seekerId",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const jobId = parseInt(String(req.params["jobId"] ?? ""), 10);
    const seekerId = String(req.params["seekerId"] ?? "");
    if (!Number.isFinite(jobId) || !seekerId) { res.status(400).json({ error: "Invalid params" }); return; }

    const job = await loadEmployerJob(jobId, req.currentUser.id);
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }

    const seekerRows = await db
      .select({ id: usersTable.id, name: usersTable.name })
      .from(usersTable)
      .where(and(eq(usersTable.id, seekerId), eq(usersTable.role, "seeker"), eq(usersTable.isActive, true)))
      .limit(1);
    if (!seekerRows[0]) { res.status(404).json({ error: "Seeker not found" }); return; }

    const employer = req.currentUser;
    const jobPath = `/jobs/${job.id}`;
    const messageBody = [
      `🎯 دعوة للتقديم على وظيفة`,
      ``,
      `الوظيفة: ${job.title}`,
      `الفئة: ${job.category}`,
      `النوع: ${job.type}`,
      ``,
      `رابط التقديم: ${jobPath}`,
    ].join("\n");

    await db.insert(messagesTable).values({
      senderId: req.currentUser.id,
      recipientId: seekerId,
      body: messageBody,
    });

    await createNotification({
      userId: seekerId,
      type: "new_job_alert",
      title: { ar: `دعوة للتقديم: ${job.title}`, en: `Job Invitation: ${job.title}` },
      body: {
        ar: `دعاك ${employer.name || "صاحب عمل"} للتقديم على وظيفة "${job.title}"`,
        en: `${employer.name || "An employer"} invited you to apply for "${job.title}"`,
      },
      link: jobPath,
    });

    res.json({ ok: true });
  },
);

router.get(
  "/employer/analytics",
  requireAuth,
  loadCurrentUser,
  requireRole("employer"),
  async (req: Request, res: Response) => {
    const employerId = req.currentUser!.id;

    const [jobs, weeklyTrends, categoryBenchmarks] = await Promise.all([
      db
        .select({
          id: jobsTable.id,
          title: jobsTable.title,
          status: jobsTable.status,
          isOpen: jobsTable.isOpen,
          viewsCount: jobsTable.viewsCount,
          category: jobsTable.category,
          salaryMin: jobsTable.salaryMin,
          salaryMax: jobsTable.salaryMax,
          salaryCurrency: jobsTable.salaryCurrency,
          deadline: jobsTable.deadline,
          createdAt: jobsTable.createdAt,
          applicationsCount: sql<number>`(
            select count(*) from ${applicationsTable} where ${applicationsTable.jobId} = ${jobsTable.id}
          )::int`,
          unseenApplicationsCount: sql<number>`(
            select count(*) from ${applicationsTable} where ${applicationsTable.jobId} = ${jobsTable.id} and ${applicationsTable.seenByEmployer} = false
          )::int`,
        })
        .from(jobsTable)
        .where(eq(jobsTable.employerId, employerId))
        .orderBy(desc(jobsTable.createdAt)),

      // Weekly application trends: last 8 weeks
      db.execute(sql`
        select
          to_char(date_trunc('week', ${applicationsTable.createdAt}), 'YYYY-MM-DD') as week,
          count(*)::int as count
        from ${applicationsTable}
        inner join ${jobsTable} on ${jobsTable.id} = ${applicationsTable.jobId}
        where ${jobsTable.employerId} = ${employerId}
          and ${applicationsTable.createdAt} >= now() - interval '8 weeks'
        group by week
        order by week asc
      `),

      // Salary benchmarks by category from all approved jobs platform-wide
      db.execute(sql`
        select
          category,
          avg(salary_min)::int as avg_salary_min,
          avg(salary_max)::int as avg_salary_max,
          count(*)::int as job_count
        from ${jobsTable}
        where status = 'approved'
          and salary_min is not null
          and salary_max is not null
        group by category
        order by category
      `),
    ]);

    const totalJobs = jobs.length;
    const totalApplications = jobs.reduce((sum, j) => sum + (j.applicationsCount ?? 0), 0);
    const totalViews = jobs.reduce((sum, j) => sum + (j.viewsCount ?? 0), 0);
    const unseenApplications = jobs.reduce((sum, j) => sum + (j.unseenApplicationsCount ?? 0), 0);

    // Conversion rate per job
    const jobsWithMetrics = jobs.map((j) => ({
      ...j,
      deadline: j.deadline ? j.deadline.toISOString() : null,
      createdAt: j.createdAt.toISOString(),
      conversionRate: j.viewsCount > 0 ? Math.round((j.applicationsCount / j.viewsCount) * 100) : 0,
    }));

    // Build salary benchmark map: category -> platform avg
    const benchmarkMap: Record<string, { avgMin: number; avgMax: number; count: number }> = {};
    for (const row of (categoryBenchmarks as any).rows ?? categoryBenchmarks) {
      benchmarkMap[row.category] = {
        avgMin: row.avg_salary_min ?? 0,
        avgMax: row.avg_salary_max ?? 0,
        count: row.job_count ?? 0,
      };
    }

    // Employer's own salary data by category
    const employerSalaryByCategory: Record<string, { min: number; max: number; currency: string }> = {};
    for (const j of jobs) {
      if (j.salaryMin != null && j.salaryMax != null) {
        employerSalaryByCategory[j.category] = {
          min: j.salaryMin,
          max: j.salaryMax,
          currency: j.salaryCurrency ?? "USD",
        };
      }
    }

    const salaryBenchmarks = Object.entries(benchmarkMap)
      .filter(([cat]) => {
        const categories = [...new Set(jobs.map((j) => j.category))];
        return categories.includes(cat);
      })
      .map(([category, platform]) => ({
        category,
        platformAvgMin: platform.avgMin,
        platformAvgMax: platform.avgMax,
        platformJobCount: platform.count,
        yourMin: employerSalaryByCategory[category]?.min ?? null,
        yourMax: employerSalaryByCategory[category]?.max ?? null,
        currency: employerSalaryByCategory[category]?.currency ?? "USD",
      }));

    const trendsRows = (weeklyTrends as any).rows ?? weeklyTrends;
    const applicationTrends = trendsRows.map((r: any) => ({
      week: r.week,
      count: r.count,
    }));

    res.json({
      totalJobs,
      totalApplications,
      totalViews,
      unseenApplications,
      jobs: jobsWithMetrics,
      applicationTrends,
      salaryBenchmarks,
    });
  },
);

export default router;
