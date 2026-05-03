import { Router, type IRouter, type Request, type Response } from "express";
import { db, notificationsTable, usersTable } from "@workspace/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { requireAuth, loadCurrentUser } from "../middlewares/auth";
import { addSseClient, removeSseClient } from "../lib/sseClients";

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
  "/me/notifications/stream",
  requireAuth,
  loadCurrentUser,
  (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).end(); return; }
    const userId = req.currentUser.id;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    res.write(": connected\n\n");

    addSseClient(userId, res);

    const keepalive = setInterval(() => {
      try { res.write(": keepalive\n\n"); } catch { /* ignore */ }
    }, 25_000);

    const authCheck = setInterval(async () => {
      try {
        const still = await db
          .select({ isActive: usersTable.isActive })
          .from(usersTable)
          .where(eq(usersTable.id, userId))
          .limit(1);
        if (!still[0] || !still[0].isActive) {
          res.write("event: force_disconnect\ndata: {}\n\n");
          res.end();
        }
      } catch { /* ignore — keep connection alive on DB error */ }
    }, 5 * 60_000);

    req.on("close", () => {
      clearInterval(keepalive);
      clearInterval(authCheck);
      removeSseClient(userId, res);
    });
  },
);

router.get(
  "/me/notifications",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
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
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
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
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const id = parseInt(String(req.params["id"] ?? ""), 10);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid id" }); return; }
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
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
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
