import { db, notificationsTable, type InsertNotification } from "@workspace/db";
import { pushSseEvent } from "./sseClients";
import { Resend } from "resend";

export type NotificationType = InsertNotification["type"];

export type BilingualText = { ar: string; en: string };

function toBilingualString(text: string | BilingualText): string {
  if (typeof text === "string") return text;
  return JSON.stringify(text);
}

function getResend() {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return null;
  return new Resend(key);
}

async function sendEmail(args: { to: string; subject: string; html: string }) {
  const resend = getResend();
  const fromEmail = process.env["RESEND_FROM_EMAIL"] ?? "onboarding@resend.dev";
  const fromName = process.env["RESEND_FROM_NAME"] ?? "Fursa";
  if (!resend) return;
  try {
    await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: args.to,
      subject: args.subject,
      html: args.html,
    });
  } catch (err) {
    console.error("Failed to send email", err);
  }
}

export async function sendNotificationEmail(args: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  await sendEmail(args);
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
