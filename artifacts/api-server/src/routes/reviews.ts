import { Router, type IRouter, type Request, type Response } from "express";
import { db, companyReviewsTable, usersTable, applicationsTable, jobsTable } from "@workspace/db";
import { and, eq, avg, count, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, loadCurrentUser, requireRole } from "../middlewares/auth";

const router: IRouter = Router();

const reviewBodySchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).nullable().optional(),
});

router.get(
  "/employers/:id/reviews",
  async (req: Request, res: Response) => {
    const employerId = String(req.params["id"] ?? "");
    if (!employerId) { res.status(400).json({ error: "Invalid employer id" }); return; }
    const rows = await db
      .select({
        id: companyReviewsTable.id,
        rating: companyReviewsTable.rating,
        comment: companyReviewsTable.comment,
        createdAt: companyReviewsTable.createdAt,
        seekerName: usersTable.name,
      })
      .from(companyReviewsTable)
      .innerJoin(usersTable, eq(usersTable.id, companyReviewsTable.seekerId))
      .where(eq(companyReviewsTable.employerId, employerId))
      .orderBy(desc(companyReviewsTable.createdAt))
      .limit(50);
    const stats = await db
      .select({
        avg: avg(companyReviewsTable.rating),
        total: count(companyReviewsTable.id),
      })
      .from(companyReviewsTable)
      .where(eq(companyReviewsTable.employerId, employerId));
    res.json({
      reviews: rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
      avgRating: stats[0]?.avg ? parseFloat(String(stats[0].avg)) : null,
      totalReviews: stats[0]?.total ?? 0,
    });
  },
);

router.post(
  "/reviews",
  requireAuth,
  loadCurrentUser,
  requireRole("seeker"),
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const employerId = req.body?.employerId;
    if (!employerId) { res.status(400).json({ error: "employerId required" }); return; }
    const parsed = reviewBodySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid review data" }); return; }
    const hasApplied = await db
      .select({ id: applicationsTable.id })
      .from(applicationsTable)
      .innerJoin(jobsTable, eq(jobsTable.id, applicationsTable.jobId))
      .where(and(eq(applicationsTable.applicantId, req.currentUser.id), eq(jobsTable.employerId, employerId)))
      .limit(1);
    if (!hasApplied[0]) { res.status(403).json({ error: "You can only review employers you applied to" }); return; }
    const inserted = await db
      .insert(companyReviewsTable)
      .values({ seekerId: req.currentUser.id, employerId, rating: parsed.data.rating, comment: parsed.data.comment ?? null })
      .onConflictDoUpdate({ target: [companyReviewsTable.seekerId, companyReviewsTable.employerId], set: { rating: parsed.data.rating, comment: parsed.data.comment ?? null } })
      .returning();
    const r = inserted[0]!;
    res.status(201).json({ ...r, createdAt: r.createdAt.toISOString() });
  },
);

router.delete(
  "/reviews/:id",
  requireAuth,
  loadCurrentUser,
  requireRole("seeker"),
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    await db.delete(companyReviewsTable).where(and(eq(companyReviewsTable.id, id), eq(companyReviewsTable.seekerId, req.currentUser.id)));
    res.status(204).end();
  },
);

export default router;
