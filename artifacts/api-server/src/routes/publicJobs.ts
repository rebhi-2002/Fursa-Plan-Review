import { Router, type IRouter, type Request, type Response } from "express";
import { db, jobsTable, usersTable, applicationsTable, savedJobsTable } from "@workspace/db";
import { and, eq, ilike, ne, or, desc, sql, asc } from "drizzle-orm";
import { getAuth } from "@clerk/express";

const router: IRouter = Router();

router.get("/jobs/featured", async (_req: Request, res: Response) => {
  try {
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
      .from(jobsTable)
      .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
      .where(and(eq(jobsTable.status, "approved"), eq(jobsTable.isOpen, true)))
      .orderBy(desc(jobsTable.createdAt))
      .limit(6);

    res.json(
      rows.map((r) => ({
        ...r,
        deadline: r.deadline ? r.deadline.toISOString() : null,
        createdAt: r.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to load featured jobs" });
  }
});

router.get("/jobs", async (req: Request, res: Response) => {
  try {
    const search = (req.query["search"] as string | undefined)?.trim();
    const type = req.query["type"] as string | undefined;
    const category = req.query["category"] as string | undefined;
    const sort = (req.query["sort"] as string | undefined) ?? "newest";
    const limit = Math.min(parseInt(req.query["limit"] as string) || 20, 100);
    const offset = parseInt(req.query["offset"] as string) || 0;

    const conditions = [
      eq(jobsTable.status, "approved"),
      eq(jobsTable.isOpen, true),
    ];
    if (type === "online" || type === "field" || type === "hybrid") {
      conditions.push(eq(jobsTable.type, type));
    }
    if (category) {
      conditions.push(eq(jobsTable.category, category));
    }
    if (search) {
      const pattern = `%${search}%`;
      const or_ = or(
        ilike(jobsTable.title, pattern),
        ilike(jobsTable.description, pattern),
        ilike(jobsTable.category, pattern),
        ilike(usersTable.name, pattern),
      );
      if (or_) conditions.push(or_);
    }

    const where = and(...conditions);

    const [items, totalRow] = await Promise.all([
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
          tags: jobsTable.tags,
          salaryMin: jobsTable.salaryMin,
          salaryMax: jobsTable.salaryMax,
          salaryCurrency: jobsTable.salaryCurrency,
          createdAt: jobsTable.createdAt,
        })
        .from(jobsTable)
        .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
        .where(where)
        .orderBy(
          sort === "deadline"
            ? asc(jobsTable.deadline)
            : sort === "oldest"
            ? asc(jobsTable.createdAt)
            : desc(jobsTable.createdAt),
        )
        .limit(limit)
        .offset(offset),
      db
        .select({ c: sql<number>`count(*)::int` })
        .from(jobsTable)
        .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
        .where(where),
    ]);

    res.json({
      items: items.map((r) => ({
        ...r,
        deadline: r.deadline ? r.deadline.toISOString() : null,
        createdAt: r.createdAt.toISOString(),
      })),
      total: totalRow[0]?.c ?? 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load jobs" });
  }
});

router.get("/jobs/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid job id" });
      return;
    }

    const rows = await db
      .select({
        id: jobsTable.id,
        title: jobsTable.title,
        description: jobsTable.description,
        requirements: jobsTable.requirements,
        type: jobsTable.type,
        category: jobsTable.category,
        contactInfo: jobsTable.contactInfo,
        tags: jobsTable.tags,
        employerName: usersTable.name,
        employerId: usersTable.id,
        employerLocation: usersTable.location,
        employerBio: usersTable.bio,
        deadline: jobsTable.deadline,
        isOpen: jobsTable.isOpen,
        viewsCount: jobsTable.viewsCount,
        salaryMin: jobsTable.salaryMin,
        salaryMax: jobsTable.salaryMax,
        salaryCurrency: jobsTable.salaryCurrency,
        createdAt: jobsTable.createdAt,
        status: jobsTable.status,
      })
      .from(jobsTable)
      .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
      .where(eq(jobsTable.id, id))
      .limit(1);

    const job = rows[0];
    if (!job || job.status !== "approved") {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    let savedByMe = false;
    let appliedByMe = false;
    const auth = getAuth(req);
    const userId =
      (auth?.sessionClaims?.["userId"] as string | undefined) ?? auth?.userId;
    if (userId) {
      const [saved, applied] = await Promise.all([
        db
          .select({ jobId: savedJobsTable.jobId })
          .from(savedJobsTable)
          .where(
            and(eq(savedJobsTable.userId, userId), eq(savedJobsTable.jobId, id)),
          )
          .limit(1),
        db
          .select({ id: applicationsTable.id })
          .from(applicationsTable)
          .where(
            and(
              eq(applicationsTable.applicantId, userId),
              eq(applicationsTable.jobId, id),
            ),
          )
          .limit(1),
      ]);
      savedByMe = saved.length > 0;
      appliedByMe = applied.length > 0;
    }

    await db
      .update(jobsTable)
      .set({ viewsCount: sql`${jobsTable.viewsCount} + 1` })
      .where(eq(jobsTable.id, id));

    const { status: _s, ...rest } = job;
    res.json({
      ...rest,
      viewsCount: (rest.viewsCount ?? 0) + 1,
      deadline: rest.deadline ? rest.deadline.toISOString() : null,
      createdAt: rest.createdAt.toISOString(),
      savedByMe,
      appliedByMe,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load job" });
  }
});

router.get("/jobs/:id/similar", async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid job id" }); return; }

    const sourceRows = await db
      .select({ category: jobsTable.category })
      .from(jobsTable)
      .where(eq(jobsTable.id, id))
      .limit(1);

    const category = sourceRows[0]?.category;
    if (!category) { res.json([]); return; }

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
      .from(jobsTable)
      .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
      .where(
        and(
          eq(jobsTable.category, category),
          eq(jobsTable.status, "approved"),
          eq(jobsTable.isOpen, true),
          ne(jobsTable.id, id),
        ),
      )
      .orderBy(desc(jobsTable.createdAt))
      .limit(4);

    res.json(
      rows.map((r) => ({
        ...r,
        deadline: r.deadline ? r.deadline.toISOString() : null,
        createdAt: r.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to load similar jobs" });
  }
});

router.get(
  "/public/seekers/:id",
  async (req: Request, res: Response) => {
    try {
      const id = String(req.params["id"] ?? "");
      if (!id) { res.status(400).json({ error: "Invalid id" }); return; }

      const rows = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          bio: usersTable.bio,
          location: usersTable.location,
        })
        .from(usersTable)
        .where(
          and(
            eq(usersTable.id, id),
            eq(usersTable.role, "seeker"),
            eq(usersTable.isActive, true),
          ),
        )
        .limit(1);

      if (!rows[0]) { res.status(404).json({ error: "Seeker not found" }); return; }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to load seeker profile" });
    }
  },
);

router.get("/sitemap.xml", async (_req, res) => {
  try {
    const appUrl = (process.env["APP_URL"] ?? "https://fursa.replit.app").replace(/\/$/, "");

    const jobs = await db
      .select({ id: jobsTable.id, createdAt: jobsTable.createdAt })
      .from(jobsTable)
      .where(and(eq(jobsTable.status, "approved"), eq(jobsTable.isOpen, true)))
      .orderBy(desc(jobsTable.createdAt))
      .limit(500);

    const staticPaths = [
      { loc: "/", priority: "1.0", changefreq: "daily" },
      { loc: "/jobs", priority: "0.9", changefreq: "hourly" },
      { loc: "/employers", priority: "0.7", changefreq: "weekly" },
      { loc: "/about", priority: "0.5", changefreq: "monthly" },
      { loc: "/contact", priority: "0.5", changefreq: "monthly" },
      { loc: "/faq", priority: "0.5", changefreq: "monthly" },
      { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
      { loc: "/terms", priority: "0.3", changefreq: "yearly" },
    ];

    const jobUrls = jobs
      .map(
        (j) =>
          `  <url>\n    <loc>${appUrl}/jobs/${j.id}</loc>\n    <lastmod>${j.createdAt.toISOString().split("T")[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
      )
      .join("\n");

    const staticUrls = staticPaths
      .map(
        (p) =>
          `  <url>\n    <loc>${appUrl}${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticUrls}\n${jobUrls}\n</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch {
    res.status(500).send("Error generating sitemap");
  }
});

router.get(
  "/public/employers",
  async (_req: Request, res: Response) => {
    try {
      const rows = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          bio: usersTable.bio,
          location: usersTable.location,
          website: usersTable.website,
          activeJobsCount: sql<number>`(
            select count(*)::int from "jobs"
            where "jobs"."employer_id" = "users"."id"
              and "jobs"."status" = 'approved'
              and "jobs"."is_open" = true
          )`,
        })
        .from(usersTable)
        .where(
          and(
            eq(usersTable.role, "employer"),
            eq(usersTable.isActive, true),
            eq(usersTable.onboarded, true),
          ),
        )
        .orderBy(
          desc(
            sql<number>`(
              select count(*)::int from "jobs"
              where "jobs"."employer_id" = "users"."id"
                and "jobs"."status" = 'approved'
                and "jobs"."is_open" = true
            )`,
          ),
          asc(usersTable.name),
        );

      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to load employers" });
    }
  },
);

router.get(
  "/public/employers/:id",
  async (req: Request, res: Response) => {
    try {
      const id = String(req.params["id"] ?? "");
      if (!id) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }

      const employers = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          bio: usersTable.bio,
          website: usersTable.website,
          location: usersTable.location,
          phone: usersTable.phone,
        })
        .from(usersTable)
        .where(
          and(
            eq(usersTable.id, id),
            eq(usersTable.role, "employer"),
            eq(usersTable.isActive, true),
          ),
        )
        .limit(1);

      if (!employers[0]) {
        res.status(404).json({ error: "Employer not found" });
        return;
      }

      const jobs = await db
        .select({
          id: jobsTable.id,
          title: jobsTable.title,
          description: jobsTable.description,
          type: jobsTable.type,
          category: jobsTable.category,
          deadline: jobsTable.deadline,
          createdAt: jobsTable.createdAt,
        })
        .from(jobsTable)
        .where(
          and(
            eq(jobsTable.employerId, id),
            eq(jobsTable.status, "approved"),
            eq(jobsTable.isOpen, true),
          ),
        )
        .orderBy(desc(jobsTable.createdAt));

      res.json({
        ...employers[0],
        jobs: jobs.map((j) => ({
          ...j,
          deadline: j.deadline ? j.deadline.toISOString() : null,
          createdAt: j.createdAt.toISOString(),
        })),
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to load employer profile" });
    }
  },
);

export default router;
