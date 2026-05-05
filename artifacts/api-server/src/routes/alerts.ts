import { Router, type IRouter, type Request, type Response } from "express";
import { db, jobAlertsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, loadCurrentUser, requireRole } from "../middlewares/auth";

const router: IRouter = Router();

const alertBodySchema = z.object({
  categories: z.array(z.string()).default([]),
  types: z.array(z.enum(["online", "field", "hybrid"])).default([]),
  isActive: z.boolean().optional(),
});

router.get(
  "/me/alerts",
  requireAuth,
  loadCurrentUser,
  requireRole("seeker"),
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const rows = await db
      .select()
      .from(jobAlertsTable)
      .where(eq(jobAlertsTable.userId, req.currentUser.id));
    res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
  },
);

router.post(
  "/me/alerts",
  requireAuth,
  loadCurrentUser,
  requireRole("seeker"),
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const parsed = alertBodySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid alert data" }); return; }
    const existing = await db.select({ id: jobAlertsTable.id }).from(jobAlertsTable).where(eq(jobAlertsTable.userId, req.currentUser.id));
    if (existing.length >= 5) { res.status(400).json({ error: "Maximum 5 alerts allowed" }); return; }
    const inserted = await db.insert(jobAlertsTable).values({
      userId: req.currentUser.id,
      categories: parsed.data.categories,
      types: parsed.data.types,
    }).returning();
    const r = inserted[0]!;
    res.status(201).json({ ...r, createdAt: r.createdAt.toISOString() });
  },
);

router.patch(
  "/me/alerts/:id",
  requireAuth,
  loadCurrentUser,
  requireRole("seeker"),
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const parsed = alertBodySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid alert data" }); return; }
    const updated = await db.update(jobAlertsTable)
      .set({ categories: parsed.data.categories, types: parsed.data.types, isActive: parsed.data.isActive ?? true })
      .where(and(eq(jobAlertsTable.id, id), eq(jobAlertsTable.userId, req.currentUser.id)))
      .returning();
    if (!updated[0]) { res.status(404).json({ error: "Alert not found" }); return; }
    const r = updated[0];
    res.json({ ...r, createdAt: r.createdAt.toISOString() });
  },
);

router.delete(
  "/me/alerts/:id",
  requireAuth,
  loadCurrentUser,
  requireRole("seeker"),
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    await db.delete(jobAlertsTable).where(and(eq(jobAlertsTable.id, id), eq(jobAlertsTable.userId, req.currentUser.id)));
    res.status(204).end();
  },
);

export default router;
