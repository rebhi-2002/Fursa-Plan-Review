import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  jobsTable,
  usersTable,
  applicationsTable,
  savedJobsTable,
} from "@workspace/db";
import { and, desc, eq, sql, ne, notInArray } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, loadCurrentUser, requireRole } from "../middlewares/auth";
import { createNotification } from "../lib/notifications";
import { broadcastAdminEvent } from "../lib/adminSse";

const router: IRouter = Router();

const applyBodySchema = z.object({
  coverLetter: z.string().nullable().optional(),
  cvObjectPath: z.string().nullable().optional(),
});

const editApplicationSchema = z.object({
  coverLetter: z.string().min(1).max(5000).nullable().optional(),
  cvObjectPath: z.string().nullable().optional(),
});

function serializeMyApp(row: {
  id: number;
  jobId: number;
  jobTitle: string;
  employerName: string;
  status: "pending" | "accepted" | "rejected";
  rejectionNote?: string | null;
  coverLetter: string | null;
  cvObjectPath: string | null;
  contactInfo?: string | null;
  createdAt: Date;
}) {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    contactInfo: row.contactInfo ?? null,
    rejectionNote: row.rejectionNote ?? null,
  };
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
    try {
      const rows = await db
        .select({
          id: applicationsTable.id,
          jobId: applicationsTable.jobId,
          jobTitle: jobsTable.title,
          employerName: usersTable.name,
          status: applicationsTable.status,
          rejectionNote: applicationsTable.rejectionNote,
          coverLetter: applicationsTable.coverLetter,
          cvObjectPath: applicationsTable.cvObjectPath,
          contactInfo: jobsTable.contactInfo,
          createdAt: applicationsTable.createdAt,
        })
        .from(applicationsTable)
        .innerJoin(jobsTable, eq(jobsTable.id, applicationsTable.jobId))
        .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
        .where(eq(applicationsTable.applicantId, req.currentUser.id))
        .orderBy(desc(applicationsTable.createdAt));
      res.json(rows.map(serializeMyApp));
    } catch (err) {
      req.log.error({ err }, "Error loading applications");
      res.status(500).json({ error: "Failed to load applications" });
    }
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

router.patch(
  "/me/applications/:id",
  requireAuth,
  loadCurrentUser,
  requireRole("seeker"),
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const parsed = editApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid data" });
      return;
    }

    try {
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
        res.status(409).json({ error: "Cannot edit an application that has already been reviewed" });
        return;
      }

      const updates: Record<string, unknown> = {};
      if (parsed.data.coverLetter !== undefined) updates["coverLetter"] = parsed.data.coverLetter;
      if (parsed.data.cvObjectPath !== undefined) updates["cvObjectPath"] = parsed.data.cvObjectPath;

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: "No fields to update" });
        return;
      }

      await db
        .update(applicationsTable)
        .set(updates)
        .where(eq(applicationsTable.id, id));

      res.status(200).json({ success: true });
    } catch (err) {
      req.log.error({ err }, "Error editing application");
      res.status(500).json({ error: "Failed to edit application" });
    }
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

    try {
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
      broadcastAdminEvent("stats_changed", { action: "new_application", jobId: job[0].id });

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
          contactInfo: job[0].contactInfo,
          createdAt: a.createdAt,
        }),
      );
    } catch (err) {
      req.log.error({ err }, "Error applying to job");
      res.status(500).json({ error: "Failed to submit application" });
    }
  },
);

router.get(
  "/me/dashboard",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const userId = req.currentUser.id;

    try {
      // Get seeker's applied job ids to exclude from recommendations
      const appliedRows = await db
        .select({
          jobId: applicationsTable.jobId,
          category: jobsTable.category,
        })
        .from(applicationsTable)
        .innerJoin(jobsTable, eq(jobsTable.id, applicationsTable.jobId))
        .where(eq(applicationsTable.applicantId, userId));

      const appliedJobIds = appliedRows.map((r) => r.jobId);
      const preferredCategories = new Set(appliedRows.map((r) => r.category));

      // Extract bio keywords (words > 2 chars)
      const bioText = req.currentUser.bio ?? "";
      const bioKeywords = bioText
        .split(/\s+/)
        .map((w) => w.toLowerCase().replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, ""))
        .filter((w) => w.length > 2);

      const [counts, savedCountRow, recent, candidateJobs] = await Promise.all([
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
            contactInfo: jobsTable.contactInfo,
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
              appliedJobIds.length > 0
                ? notInArray(jobsTable.id, appliedJobIds)
                : undefined,
            ),
          )
          .orderBy(desc(jobsTable.createdAt))
          .limit(50),
      ]);

      // Score and rank jobs for this seeker
      const scored = candidateJobs.map((job) => {
        let score = 0;
        // +3 for matching a preferred category
        if (preferredCategories.has(job.category)) score += 3;
        // +2 for each title word found in bio keywords
        if (bioKeywords.length > 0) {
          const titleWords = job.title
            .toLowerCase()
            .split(/\s+/)
            .map((w) => w.replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, ""));
          for (const tw of titleWords) {
            if (tw.length > 2 && bioKeywords.some((bk) => tw.includes(bk) || bk.includes(tw))) {
              score += 2;
              break;
            }
          }
        }
        return { ...job, score };
      });

      scored.sort((a, b) => b.score - a.score || b.createdAt.getTime() - a.createdAt.getTime());
      const recommended = scored.slice(0, 6);

      let pending = 0, accepted = 0, rejected = 0, total = 0;
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
    } catch (err) {
      req.log.error({ err }, "Error loading dashboard");
      res.status(500).json({ error: "Failed to load dashboard" });
    }
  },
);

export default router;
