import { db, notificationsTable, type InsertNotification } from "@workspace/db";
import { pushSseEvent } from "./sseClients";

export type NotificationType = InsertNotification["type"];

export async function createNotification(args: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string | null;
}): Promise<void> {
  try {
    const [row] = await db
      .insert(notificationsTable)
      .values({
        userId: args.userId,
        type: args.type,
        title: args.title,
        body: args.body,
        link: args.link ?? null,
      })
      .returning();

    pushSseEvent(args.userId, "notification", {
      id: row?.id,
      type: args.type,
      title: args.title,
      body: args.body,
      link: args.link ?? null,
      read: false,
      createdAt: row?.createdAt?.toISOString() ?? new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to create notification", err);
  }
}
