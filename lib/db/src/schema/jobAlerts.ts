import { pgTable, serial, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const jobAlertsTable = pgTable(
  "job_alerts",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    categories: text("categories").array().notNull().default([]),
    types: text("types").array().notNull().default([]),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("job_alerts_user_idx").on(table.userId),
    index("job_alerts_active_idx").on(table.isActive),
  ],
);

export type JobAlertRow = typeof jobAlertsTable.$inferSelect;
export type InsertJobAlert = typeof jobAlertsTable.$inferInsert;
