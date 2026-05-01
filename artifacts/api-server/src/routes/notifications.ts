import { Router, type IRouter, type Request, type Response } from "express";
import { db, notificationsTable } from "@workspace/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { requireAuth, loadCurrentUser } from "../middlewares/auth";

const router: IRouter = Router();

function serialize(row: typeof notificationsTable.$inferSelect) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    link: row.link,
    read: row.read,
    createdAt: row.createdAt.toISOString(),
  };
}

router.get(
  "/me/notifications",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser)
      return res.status(401).json({ error: "Unauthorized" });
    const rows = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, req.currentUser.id))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(50);
    res.json(rows.map(serialize));
  },
);

router.get(
  "/me/notifications/unread-count",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser)
      return res.status(401).json({ error: "Unauthorized" });
    const rows = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(notificationsTable)
      .where(
        and(
          eq(notificationsTable.userId, req.currentUser.id),
          eq(notificationsTable.read, false),
        ),
      );
    res.json({ count: rows[0]?.c ?? 0 });
  },
);

router.post(
  "/me/notifications/:id/read",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser)
      return res.status(401).json({ error: "Unauthorized" });
    const id = parseInt(req.params["id"] ?? "");
    if (!Number.isFinite(id))
      return res.status(400).json({ error: "Invalid id" });
    await db
      .update(notificationsTable)
      .set({ read: true })
      .where(
        and(
          eq(notificationsTable.id, id),
          eq(notificationsTable.userId, req.currentUser.id),
        ),
      );
    res.status(204).end();
  },
);

router.post(
  "/me/notifications/read-all",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser)
      return res.status(401).json({ error: "Unauthorized" });
    await db
      .update(notificationsTable)
      .set({ read: true })
      .where(
        and(
          eq(notificationsTable.userId, req.currentUser.id),
          eq(notificationsTable.read, false),
        ),
      );
    res.status(204).end();
  },
);

export default router;
