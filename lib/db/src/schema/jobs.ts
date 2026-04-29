import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const jobTypeEnum = pgEnum("job_type", ["online", "field", "hybrid"]);
export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "approved",
  "rejected",
]);

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  employerId: text("employer_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  type: jobTypeEnum("type").notNull(),
  category: text("category").notNull(),
  contactInfo: text("contact_info").notNull(),
  status: jobStatusEnum("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  isOpen: boolean("is_open").notNull().default(true),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type JobRow = typeof jobsTable.$inferSelect;
export type InsertJob = typeof jobsTable.$inferInsert;
