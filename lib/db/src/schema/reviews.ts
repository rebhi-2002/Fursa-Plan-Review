import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const companyReviewsTable = pgTable(
  "company_reviews",
  {
    id: serial("id").primaryKey(),
    seekerId: text("seeker_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    employerId: text("employer_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("reviews_employer_idx").on(table.employerId),
    index("reviews_seeker_idx").on(table.seekerId),
    uniqueIndex("reviews_unique_seeker_employer").on(
      table.seekerId,
      table.employerId,
    ),
  ],
);

export type CompanyReviewRow = typeof companyReviewsTable.$inferSelect;
export type InsertCompanyReview = typeof companyReviewsTable.$inferInsert;
