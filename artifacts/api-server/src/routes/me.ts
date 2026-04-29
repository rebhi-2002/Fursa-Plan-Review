import { Router, type IRouter, type Request, type Response } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, loadCurrentUser } from "../middlewares/auth";

const router: IRouter = Router();

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  cvObjectPath: z.string().nullable().optional(),
});

const setRoleSchema = z.object({
  role: z.enum(["seeker", "employer"]),
});

function serializeUser(u: {
  id: string;
  name: string;
  email: string;
  role: "seeker" | "employer" | "admin";
  phone: string | null;
  location: string | null;
  bio: string | null;
  cvObjectPath: string | null;
  isActive: boolean;
  onboarded: boolean;
  createdAt: Date;
}) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    location: u.location,
    bio: u.bio,
    cvObjectPath: u.cvObjectPath,
    isActive: u.isActive,
    onboarded: u.onboarded,
    createdAt: u.createdAt.toISOString(),
  };
}

router.get(
  "/me",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.json(serializeUser(req.currentUser));
  },
);

router.patch(
  "/me",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid profile data" });
      return;
    }
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(parsed.data)) {
      if (v !== undefined) updates[k] = v;
    }
    if (Object.keys(updates).length === 0) {
      res.json(serializeUser(req.currentUser));
      return;
    }
    const updated = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, req.currentUser.id))
      .returning();
    if (!updated[0]) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(serializeUser(updated[0]));
  },
);

router.post(
  "/me/role",
  requireAuth,
  loadCurrentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const parsed = setRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid role" });
      return;
    }
    if (req.currentUser.role === "admin") {
      res.status(403).json({ error: "Admin role cannot be changed" });
      return;
    }
    const updated = await db
      .update(usersTable)
      .set({ role: parsed.data.role, onboarded: true })
      .where(eq(usersTable.id, req.currentUser.id))
      .returning();
    if (!updated[0]) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(serializeUser(updated[0]));
  },
);

export default router;
