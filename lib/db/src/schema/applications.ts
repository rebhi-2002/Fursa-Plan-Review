import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { jobsTable } from "./jobs";

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "accepted",
  "rejected",
]);

export const applicationsTable = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobsTable.id, { onDelete: "cascade" }),
    applicantId: text("applicant_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    coverLetter: text("cover_letter"),
    cvObjectPath: text("cv_object_path"),
    status: applicationStatusEnum("status").notNull().default("pending"),
    seenByEmployer: boolean("seen_by_employer").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    uniqueApplicantJob: uniqueIndex("applications_applicant_job_unique").on(
      t.applicantId,
      t.jobId,
    ),
  }),
);

export type ApplicationRow = typeof applicationsTable.$inferSelect;
export type InsertApplication = typeof applicationsTable.$inferInsert;
