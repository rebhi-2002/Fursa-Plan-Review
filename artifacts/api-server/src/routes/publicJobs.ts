import { Router, type IRouter, type Request, type Response } from "express";
import { db, jobsTable, usersTable, applicationsTable, savedJobsTable } from "@workspace/db";
import { and, eq, ilike, or, desc, sql } from "drizzle-orm";
import { getAuth } from "@clerk/express";

const router: IRouter = Router();

router.get("/jobs/featured", async (_req: Request, res: Response) => {
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

  res.json(rows);
});

router.get("/jobs", async (req: Request, res: Response) => {
  const search = (req.query["search"] as string | undefined)?.trim();
  const type = req.query["type"] as string | undefined;
  const category = req.query["category"] as string | undefined;
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
        createdAt: jobsTable.createdAt,
      })
      .from(jobsTable)
      .innerJoin(usersTable, eq(usersTable.id, jobsTable.employerId))
      .where(where)
      .orderBy(desc(jobsTable.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(jobsTable)
      .where(where),
  ]);

  res.json({ items, total: totalRow[0]?.c ?? 0 });
});

router.get("/jobs/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] ?? "");
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
      employerName: usersTable.name,
      employerLocation: usersTable.location,
      employerBio: usersTable.bio,
      deadline: jobsTable.deadline,
      isOpen: jobsTable.isOpen,
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

  const { status: _s, ...rest } = job;
  res.json({ ...rest, savedByMe, appliedByMe });
});

export default router;
