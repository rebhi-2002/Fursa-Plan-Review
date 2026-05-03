import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

router.post("/contact", async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid contact form data" });
    return;
  }
  const { name, email, subject, message } = parsed.data;
  logger.info({ name, email, subject, messageLength: message.length }, "Contact form submission");
  res.status(200).json({ success: true });
});

export default router;
