import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const jobTypeEnum = pgEnum("job_type", ["online", "field", "hybrid"]);
export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "approved",
  "rejected",
]);

export const jobsTable = pgTable(
  "jobs",
  {
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
    tags: text("tags"),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    salaryCurrency: text("salary_currency").default("USD"),
    viewsCount: integer("views_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    archivedAt: timestamp("archived_at"),
  },
  (table) => [
    index("jobs_status_idx").on(table.status),
    index("jobs_category_idx").on(table.category),
    index("jobs_employer_idx").on(table.employerId),
    index("jobs_status_open_idx").on(table.status, table.isOpen),
  ],
);

export type JobRow = typeof jobsTable.$inferSelect;
export type InsertJob = typeof jobsTable.$inferInsert;
