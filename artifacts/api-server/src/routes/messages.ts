import { Router, type IRouter, type Request, type Response } from "express";
import { db, messagesTable, usersTable } from "@workspace/db";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, loadCurrentUser } from "../middlewares/auth";
import { pushSseEvent } from "../lib/sseClients";

const router: IRouter = Router();

const sendBodySchema = z.object({
  body: z.string().min(1).max(2000),
});

router.get(
  "/me/messages/unread-count",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const userId = req.currentUser.id;
    const [row] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(messagesTable)
      .where(and(eq(messagesTable.recipientId, userId), eq(messagesTable.read, false)));
    res.json({ total: row?.total ?? 0 });
  },
);

router.get(
  "/me/messages/threads",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const userId = req.currentUser.id;

    const rows = await db
      .selectDistinctOn(
        [sql`LEAST(${messagesTable.senderId}, ${messagesTable.recipientId}), GREATEST(${messagesTable.senderId}, ${messagesTable.recipientId})`],
        {
          id: messagesTable.id,
          senderId: messagesTable.senderId,
          recipientId: messagesTable.recipientId,
          body: messagesTable.body,
          read: messagesTable.read,
          createdAt: messagesTable.createdAt,
        },
      )
      .from(messagesTable)
      .where(
        or(
          eq(messagesTable.senderId, userId),
          eq(messagesTable.recipientId, userId),
        ),
      )
      .orderBy(
        sql`LEAST(${messagesTable.senderId}, ${messagesTable.recipientId}), GREATEST(${messagesTable.senderId}, ${messagesTable.recipientId})`,
        desc(messagesTable.createdAt),
      );

    const otherUserIds = rows.map((r) =>
      r.senderId === userId ? r.recipientId : r.senderId,
    );

    const users =
      otherUserIds.length > 0
        ? await db
            .select({ id: usersTable.id, name: usersTable.name, role: usersTable.role })
            .from(usersTable)
            .where(sql`${usersTable.id} = ANY(ARRAY[${sql.join(otherUserIds.map((id) => sql`${id}`), sql`, `)}]::text[])`)
        : [];

    const unreadCounts = await db
      .select({
        senderId: messagesTable.senderId,
        cnt: sql<number>`count(*)::int`,
      })
      .from(messagesTable)
      .where(
        and(
          eq(messagesTable.recipientId, userId),
          eq(messagesTable.read, false),
        ),
      )
      .groupBy(messagesTable.senderId);

    const unreadMap: Record<string, number> = {};
    for (const uc of unreadCounts) {
      unreadMap[uc.senderId] = uc.cnt;
    }

    const threads = rows.map((r) => {
      const otherId = r.senderId === userId ? r.recipientId : r.senderId;
      const user = users.find((u) => u.id === otherId);
      return {
        userId: otherId,
        userName: user?.name ?? otherId,
        userRole: user?.role ?? "seeker",
        lastMessage: r.body,
        lastMessageAt: r.createdAt.toISOString(),
        unreadCount: unreadMap[otherId] ?? 0,
      };
    });

    res.json(threads);
  },
);

router.get(
  "/me/messages/:userId",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const myId = req.currentUser.id;
    const otherId = String(req.params["userId"] ?? "");
    if (!otherId) { res.status(400).json({ error: "Invalid userId" }); return; }

    await db
      .update(messagesTable)
      .set({ read: true })
      .where(
        and(
          eq(messagesTable.senderId, otherId),
          eq(messagesTable.recipientId, myId),
          eq(messagesTable.read, false),
        ),
      );

    const rows = await db
      .select()
      .from(messagesTable)
      .where(
        or(
          and(eq(messagesTable.senderId, myId), eq(messagesTable.recipientId, otherId)),
          and(eq(messagesTable.senderId, otherId), eq(messagesTable.recipientId, myId)),
        ),
      )
      .orderBy(desc(messagesTable.createdAt))
      .limit(100);

    res.json(
      rows.reverse().map((r) => ({
        id: r.id,
        senderId: r.senderId,
        recipientId: r.recipientId,
        body: r.body,
        read: r.read,
        createdAt: r.createdAt.toISOString(),
      })),
    );
  },
);

router.post(
  "/me/messages/:userId",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const myId = req.currentUser.id;
    const otherId = String(req.params["userId"] ?? "");
    if (!otherId || otherId === myId) {
      res.status(400).json({ error: "Invalid userId" });
      return;
    }

    const parsed = sendBodySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid message body" }); return; }

    const target = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(and(eq(usersTable.id, otherId), eq(usersTable.isActive, true)))
      .limit(1);
    if (!target[0]) { res.status(404).json({ error: "User not found" }); return; }

    const inserted = await db
      .insert(messagesTable)
      .values({ senderId: myId, recipientId: otherId, body: parsed.data.body })
      .returning();

    const msg = inserted[0]!;

    pushSseEvent(otherId, "new_message", {
      senderId: myId,
      body: parsed.data.body,
      createdAt: msg.createdAt.toISOString(),
    });

    res.status(201).json({
      id: msg.id,
      senderId: msg.senderId,
      recipientId: msg.recipientId,
      body: msg.body,
      read: msg.read,
      createdAt: msg.createdAt.toISOString(),
    });
  },
);

export default router;
