import { Router, type IRouter, type Request, type Response } from "express";
import { db, jobsTable, usersTable, applicationsTable } from "@workspace/db";
import { eq, sql, and, desc } from "drizzle-orm";

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

router.get("/sitemap.xml", async (_req: Request, res: Response) => {
  try {
    const base = process.env["SITE_URL"] || "https://fursa.ps";

    const jobs = await db
      .select({ id: jobsTable.id, createdAt: jobsTable.createdAt })
      .from(jobsTable)
      .where(and(eq(jobsTable.status, "approved"), eq(jobsTable.isOpen, true)))
      .orderBy(desc(jobsTable.createdAt))
      .limit(1000);

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/jobs", priority: "0.9", changefreq: "hourly" },
      { url: "/employers", priority: "0.8", changefreq: "daily" },
      { url: "/about", priority: "0.6", changefreq: "monthly" },
      { url: "/faq", priority: "0.6", changefreq: "monthly" },
      { url: "/contact", priority: "0.5", changefreq: "monthly" },
      { url: "/how-it-works", priority: "0.7", changefreq: "monthly" },
      { url: "/for-employers", priority: "0.7", changefreq: "monthly" },
      { url: "/success-stories", priority: "0.6", changefreq: "weekly" },
      { url: "/privacy", priority: "0.3", changefreq: "yearly" },
      { url: "/terms", priority: "0.3", changefreq: "yearly" },
    ];

    const now = new Date().toISOString().split("T")[0];

    const jobEntries = jobs.map((j) => {
      const lastmod = j.createdAt.toISOString().split("T")[0];
      return `  <url>
    <loc>${base}/jobs/${j.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    const staticEntries = staticPages.map((p) => `  <url>
    <loc>${base}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...staticEntries,
      ...jobEntries,
      "</urlset>",
    ].join("\n");

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Error generating sitemap");
  }
});

export default router;
