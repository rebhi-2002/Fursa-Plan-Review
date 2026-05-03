import { type Request, type Response, type NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { db, usersTable, type UserRow } from "@workspace/db";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserRow;
      authUserId?: string;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.["userId"] as string | undefined ?? auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.authUserId = userId;
  next();
}

export async function loadCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.authUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.authUserId;

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (existing[0]) {
    req.currentUser = existing[0];
    next();
    return;
  }

  // First time login - auto-create user from Clerk profile
  try {
    const clerkUser = await clerkClient.users.getUser(userId);
    const primaryEmail =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? "";
    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      clerkUser.username ||
      primaryEmail.split("@")[0] ||
      "مستخدم";

    const inserted = await db
      .insert(usersTable)
      .values({
        id: userId,
        name,
        email: primaryEmail,
        role: "seeker",
        isActive: true,
        onboarded: false,
      })
      .returning();
    req.currentUser = inserted[0];
    next();
  } catch (error) {
    req.log.error({ err: error }, "Failed to bootstrap user from Clerk");
    res.status(500).json({ error: "Failed to load user" });
  }
}

export function requireRole(...roles: Array<"seeker" | "employer" | "admin">) {
  return function roleMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.currentUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!req.currentUser.isActive) {
      res.status(403).json({ error: "Your account is disabled" });
      return;
    }
    if (!roles.includes(req.currentUser.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    if (!req.currentUser.onboarded && req.currentUser.role !== "admin") {
      res.status(403).json({ error: "Please complete your profile first", code: "ONBOARDING_REQUIRED" });
      return;
    }
    next();
  };
}
