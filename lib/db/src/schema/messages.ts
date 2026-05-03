import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const messagesTable = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    senderId: text("sender_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    recipientId: text("recipient_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("messages_sender_idx").on(t.senderId),
    index("messages_recipient_idx").on(t.recipientId),
    index("messages_thread_idx").on(t.senderId, t.recipientId),
  ],
);

export type MessageRow = typeof messagesTable.$inferSelect;
export type InsertMessage = typeof messagesTable.$inferInsert;
