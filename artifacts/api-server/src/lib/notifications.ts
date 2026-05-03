import { db, notificationsTable, type InsertNotification } from "@workspace/db";
import { pushSseEvent } from "./sseClients";

export type NotificationType = InsertNotification["type"];

export type BilingualText = { ar: string; en: string };

function toBilingualString(text: string | BilingualText): string {
  if (typeof text === "string") return text;
  return JSON.stringify(text);
}

export async function createNotification(args: {
  userId: string;
  type: NotificationType;
  title: string | BilingualText;
  body: string | BilingualText;
  link?: string | null;
}): Promise<void> {
  const titleStr = toBilingualString(args.title);
  const bodyStr = toBilingualString(args.body);

  try {
    const [row] = await db
      .insert(notificationsTable)
      .values({
        userId: args.userId,
        type: args.type,
        title: titleStr,
        body: bodyStr,
        link: args.link ?? null,
      })
      .returning();

    pushSseEvent(args.userId, "notification", {
      id: row?.id,
      type: args.type,
      title: titleStr,
      body: bodyStr,
      link: args.link ?? null,
      read: false,
      createdAt: row?.createdAt?.toISOString() ?? new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to create notification", err);
  }
}
