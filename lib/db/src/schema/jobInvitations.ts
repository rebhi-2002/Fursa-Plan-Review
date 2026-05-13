import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { jobsTable } from "./jobs";

export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "declined",
]);

export const jobInvitationsTable = pgTable(
  "job_invitations",
  {
    id: serial("id").primaryKey(),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobsTable.id, { onDelete: "cascade" }),
    employerId: text("employer_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    seekerId: text("seeker_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    message: text("message"),
    status: invitationStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    respondedAt: timestamp("responded_at"),
  },
  (t) => ({
    uniqueInvitation: uniqueIndex("job_invitations_seeker_job_unique").on(
      t.seekerId,
      t.jobId,
    ),
  }),
);

export type JobInvitationRow = typeof jobInvitationsTable.$inferSelect;
export type InsertJobInvitation = typeof jobInvitationsTable.$inferInsert;
