import { db, notificationsTable, type InsertNotification } from "@workspace/db";

export type NotificationType = InsertNotification["type"];

export async function createNotification(args: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string | null;
}): Promise<void> {
  try {
    await db.insert(notificationsTable).values({
      userId: args.userId,
      type: args.type,
      title: args.title,
      body: args.body,
      link: args.link ?? null,
    });
  } catch (err) {
    console.error("Failed to create notification", err);
  }
}
