import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { logger } from "../lib/logger";
import { sendNotificationEmail } from "../lib/notifications";

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

  const adminEmail = process.env["CONTACT_RECIPIENT_EMAIL"];
  if (adminEmail) {
    await sendNotificationEmail({
      to: adminEmail,
      subject: `[Fursa Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1d4ed8;">رسالة جديدة من نموذج التواصل</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #374151;">الاسم:</td><td style="padding: 8px;">${name}</td></tr>
            <tr style="background:#f9fafb;"><td style="padding: 8px; font-weight: bold; color: #374151;">البريد الإلكتروني:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #374151;">الموضوع:</td><td style="padding: 8px;">${subject}</td></tr>
            <tr style="background:#f9fafb;"><td colspan="2" style="padding: 8px; font-weight: bold; color: #374151;">الرسالة:</td></tr>
            <tr><td colspan="2" style="padding: 16px; white-space: pre-wrap; border: 1px solid #e5e7eb; border-radius: 6px;">${message}</td></tr>
          </table>
        </div>
      `,
    });
  }

  await sendNotificationEmail({
    to: email,
    subject: `تأكيد استلام رسالتك - فُرصة`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
        <h2 style="color: #1d4ed8;">شكراً لتواصلك معنا، ${name}!</h2>
        <p style="color: #374151;">لقد استلمنا رسالتك بخصوص "<strong>${subject}</strong>" وسنرد عليك في أقرب وقت ممكن.</p>
        <hr style="border: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #6b7280; font-size: 14px;">فريق منصة فُرصة</p>
      </div>
    `,
  });

  res.status(200).json({ success: true });
});

export default router;
