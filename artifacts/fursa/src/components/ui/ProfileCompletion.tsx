import { useT, useLanguageStore } from "@/lib/i18n";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ProfileCompletionProps {
  role: "seeker" | "employer" | "admin";
  name?: string | null;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  cvObjectPath?: string | null;
  website?: string | null;
  profilePath: string;
  className?: string;
}

export function ProfileCompletion({
  role,
  name,
  phone,
  location,
  bio,
  cvObjectPath,
  website,
  profilePath,
  className,
}: ProfileCompletionProps) {
  const t = useT();
  const { lang } = useLanguageStore();

  const fields: { label: string; done: boolean; weight: number }[] =
    role === "seeker"
      ? [
          { label: lang === "ar" ? "الاسم" : "Full name", done: !!name, weight: 20 },
          { label: lang === "ar" ? "رقم الهاتف" : "Phone number", done: !!phone, weight: 15 },
          { label: lang === "ar" ? "الموقع" : "Location", done: !!location, weight: 15 },
          { label: lang === "ar" ? "نبذة شخصية" : "Short bio", done: !!bio, weight: 20 },
          { label: lang === "ar" ? "رفع السيرة الذاتية" : "Upload CV", done: !!cvObjectPath, weight: 30 },
        ]
      : role === "employer"
      ? [
          { label: lang === "ar" ? "اسم الشركة" : "Company name", done: !!name, weight: 20 },
          { label: lang === "ar" ? "رقم الهاتف" : "Phone number", done: !!phone, weight: 15 },
          { label: lang === "ar" ? "الموقع" : "Location", done: !!location, weight: 15 },
          { label: lang === "ar" ? "نبذة عن الشركة" : "Company bio", done: !!bio, weight: 25 },
          { label: lang === "ar" ? "الموقع الإلكتروني" : "Website", done: !!website, weight: 25 },
        ]
      : [
          { label: lang === "ar" ? "الاسم" : "Full name", done: !!name, weight: 30 },
          { label: lang === "ar" ? "رقم الهاتف" : "Phone number", done: !!phone, weight: 20 },
          { label: lang === "ar" ? "الموقع" : "Location", done: !!location, weight: 25 },
          { label: lang === "ar" ? "نبذة شخصية" : "Short bio", done: !!bio, weight: 25 },
        ];

  const percent = fields.reduce((sum, f) => sum + (f.done ? f.weight : 0), 0);
  const missing = fields.filter((f) => !f.done);

  if (percent === 100) return null;

  const barColor =
    percent >= 70 ? "bg-emerald-500" : percent >= 40 ? "bg-amber-500" : "bg-red-500";
  const textColor =
    percent >= 70 ? "text-emerald-600" : percent >= 40 ? "text-amber-600" : "text-red-600";
  const bgColor =
    percent >= 70 ? "bg-emerald-50 border-emerald-200" : percent >= 40 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  return (
    <div className={cn("rounded-xl border p-4 space-y-3", bgColor, className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className={cn("h-4 w-4 shrink-0", textColor)} />
          <p className={cn("text-sm font-semibold", textColor)}>
            {lang === "ar"
              ? `اكتمال الملف الشخصي — ${percent}%`
              : `Profile completion — ${percent}%`}
          </p>
        </div>
        <Link
          href={profilePath}
          className={cn(
            "text-xs font-medium hover:underline shrink-0",
            textColor,
          )}
        >
          {lang === "ar" ? "أكمل الملف ←" : "Complete →"}
        </Link>
      </div>

      <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>

      {missing.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {missing.map((f) => (
            <span
              key={f.label}
              className="text-xs px-2 py-0.5 rounded-full bg-white/70 border border-current/20 text-muted-foreground"
            >
              {f.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
