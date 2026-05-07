import { useState, useEffect } from "react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Printer, FileText, ChevronDown, ChevronUp, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Experience {
  id: string; title: string; company: string; location: string; period: string; description: string;
}
interface Education {
  id: string; degree: string; institution: string; year: string; gpa: string;
}
interface Language {
  id: string; name: string; level: string;
}
interface Certificate {
  id: string; name: string; issuer: string; year: string;
}

function uid() { return Math.random().toString(36).slice(2); }

const COLOR_THEMES = [
  { name: "Indigo",  header: "#3730a3", accent: "#4f46e5", light: "#eef2ff" },
  { name: "Blue",    header: "#1d4ed8", accent: "#2563eb", light: "#eff6ff" },
  { name: "Teal",    header: "#0f766e", accent: "#0d9488", light: "#f0fdfa" },
  { name: "Slate",   header: "#1e293b", accent: "#334155", light: "#f1f5f9" },
  { name: "Rose",    header: "#be123c", accent: "#e11d48", light: "#fff1f2" },
  { name: "Forest",  header: "#15803d", accent: "#16a34a", light: "#f0fdf4" },
];

const FONT_OPTIONS = [
  { id: "cairo",      label: "Cairo (Arabic)",       css: "'Cairo', 'Segoe UI', sans-serif" },
  { id: "opensans",   label: "Open Sans",             css: "'Open Sans', 'Segoe UI', sans-serif" },
  { id: "roboto",     label: "Roboto",                css: "'Roboto', 'Segoe UI', sans-serif" },
  { id: "georgia",    label: "Georgia (Serif)",       css: "'Georgia', 'Times New Roman', serif" },
  { id: "montserrat", label: "Montserrat",            css: "'Montserrat', 'Segoe UI', sans-serif" },
];

const LANG_LEVELS = ["مبتدئ", "متوسط", "متقدم", "متمكن", "أصلي / Beginner / Intermediate / Advanced / Fluent / Native"];

function FormSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <CardHeader className="pb-3 cursor-pointer select-none" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      {open && <CardContent className="space-y-3 pt-0">{children}</CardContent>}
    </Card>
  );
}

export default function CvBuilderPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const { data: user } = useGetCurrentUser();

  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [themeIdx, setThemeIdx] = useState(0);
  const [fontIdx, setFontIdx] = useState(0);

  const [experiences, setExperiences] = useState<Experience[]>([
    { id: uid(), title: "", company: "", location: "", period: "", description: "" },
  ]);
  const [educations, setEducations] = useState<Education[]>([
    { id: uid(), degree: "", institution: "", year: "", gpa: "" },
  ]);
  const [languages, setLanguages] = useState<Language[]>([
    { id: uid(), name: "", level: "" },
  ]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    if (user) {
      if (user.name && !name) setName(user.name);
      if (user.email && !email) setEmail(user.email);
      if ((user.phone as string | undefined | null) && !phone) setPhone((user.phone as string) ?? "");
      if ((user.location as string | undefined | null) && !location) setLocation((user.location as string) ?? "");
      if ((user.website as string | undefined | null) && !linkedin) setLinkedin((user.website as string) ?? "");
      if ((user.bio as string | undefined | null) && !summary) setSummary((user.bio as string) ?? "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addExp = () => setExperiences(p => [...p, { id: uid(), title: "", company: "", location: "", period: "", description: "" }]);
  const removeExp = (id: string) => setExperiences(p => p.filter(e => e.id !== id));
  const updateExp = (id: string, field: keyof Omit<Experience, "id">, val: string) =>
    setExperiences(p => p.map(e => e.id === id ? { ...e, [field]: val } : e));

  const addEdu = () => setEducations(p => [...p, { id: uid(), degree: "", institution: "", year: "", gpa: "" }]);
  const removeEdu = (id: string) => setEducations(p => p.filter(e => e.id !== id));
  const updateEdu = (id: string, field: keyof Omit<Education, "id">, val: string) =>
    setEducations(p => p.map(e => e.id === id ? { ...e, [field]: val } : e));

  const addLang = () => setLanguages(p => [...p, { id: uid(), name: "", level: "" }]);
  const removeLang = (id: string) => setLanguages(p => p.filter(e => e.id !== id));
  const updateLang = (id: string, field: keyof Omit<Language, "id">, val: string) =>
    setLanguages(p => p.map(e => e.id === id ? { ...e, [field]: val } : e));

  const addCert = () => setCertificates(p => [...p, { id: uid(), name: "", issuer: "", year: "" }]);
  const removeCert = (id: string) => setCertificates(p => p.filter(e => e.id !== id));
  const updateCert = (id: string, field: keyof Omit<Certificate, "id">, val: string) =>
    setCertificates(p => p.map(e => e.id === id ? { ...e, [field]: val } : e));

  const skillList = skills.split(",").map(s => s.trim()).filter(Boolean);
  const theme = COLOR_THEMES[themeIdx]!;
  const font = FONT_OPTIONS[fontIdx]!;
  const isRTL = lang === "ar";

  const handlePrint = () => window.print();

  const CVPreview = (
    <div
      className="cv-preview-card bg-white overflow-hidden"
      style={{ fontFamily: font.css, direction: "ltr", fontSize: "13px", lineHeight: "1.5" }}
    >
      {/* CV Header */}
      <div className="px-9 py-7" style={{ background: theme.header }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", letterSpacing: "-0.3px", marginBottom: "4px" }}>
          {name || (isRTL ? "الاسم الكامل" : "Full Name")}
        </h1>
        {headline && (
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", marginBottom: "8px", fontWeight: 500 }}>
            {headline}
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 20px", marginTop: "6px" }}>
          {email && <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)" }}>{email}</span>}
          {phone && <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)" }} dir="ltr">{phone}</span>}
          {location && <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)" }}>{location}</span>}
          {(linkedin || website) && (
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)" }}>
              {(linkedin || website).replace(/^https?:\/\//, "")}
            </span>
          )}
        </div>
      </div>

      {/* CV Body */}
      <div className="px-9 py-6 bg-white" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* Summary */}
        {summary && (
          <div>
            <h2 style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: theme.accent, marginBottom: "6px" }}>
              {isRTL ? "الملخص المهني" : "PROFESSIONAL SUMMARY"}
            </h2>
            <div style={{ height: "2px", background: theme.light, marginBottom: "8px" }} />
            <p style={{ fontSize: "12.5px", color: "#374151", lineHeight: "1.65" }}>{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.some(e => e.title || e.company) && (
          <div>
            <h2 style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: theme.accent, marginBottom: "6px" }}>
              {isRTL ? "الخبرات العملية" : "WORK EXPERIENCE"}
            </h2>
            <div style={{ height: "2px", background: theme.light, marginBottom: "10px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {experiences.filter(e => e.title || e.company).map(exp => (
                <div key={exp.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "13px", color: "#111827" }}>{exp.title}</p>
                      <p style={{ fontSize: "12px", color: "#4b5563", fontWeight: 500 }}>
                        {exp.company}{exp.location ? ` • ${exp.location}` : ""}
                      </p>
                    </div>
                    {exp.period && (
                      <span style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap", marginTop: "1px" }}>
                        {exp.period}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px", lineHeight: "1.6" }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {educations.some(e => e.degree || e.institution) && (
          <div>
            <h2 style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: theme.accent, marginBottom: "6px" }}>
              {isRTL ? "التعليم" : "EDUCATION"}
            </h2>
            <div style={{ height: "2px", background: theme.light, marginBottom: "10px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {educations.filter(e => e.degree || e.institution).map(edu => (
                <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "13px", color: "#111827" }}>{edu.degree}</p>
                    <p style={{ fontSize: "12px", color: "#4b5563" }}>
                      {edu.institution}{edu.gpa ? ` — GPA: ${edu.gpa}` : ""}
                    </p>
                  </div>
                  {edu.year && <span style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap", marginTop: "1px" }}>{edu.year}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two column: Skills + Languages */}
        {(skillList.length > 0 || languages.some(l => l.name)) && (
          <div style={{ display: "grid", gridTemplateColumns: languages.some(l => l.name) ? "1fr 1fr" : "1fr", gap: "20px" }}>
            {skillList.length > 0 && (
              <div>
                <h2 style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: theme.accent, marginBottom: "6px" }}>
                  {isRTL ? "المهارات" : "SKILLS"}
                </h2>
                <div style={{ height: "2px", background: theme.light, marginBottom: "8px" }} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {skillList.map(s => (
                    <span key={s} style={{ fontSize: "10.5px", padding: "2px 9px", borderRadius: "12px", background: theme.light, color: theme.accent, fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {languages.some(l => l.name) && (
              <div>
                <h2 style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: theme.accent, marginBottom: "6px" }}>
                  {isRTL ? "اللغات" : "LANGUAGES"}
                </h2>
                <div style={{ height: "2px", background: theme.light, marginBottom: "8px" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {languages.filter(l => l.name).map(l => (
                    <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <span style={{ fontWeight: 600, color: "#111827" }}>{l.name}</span>
                      {l.level && <span style={{ color: "#6b7280" }}>{l.level}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Certifications */}
        {certificates.some(c => c.name) && (
          <div>
            <h2 style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: theme.accent, marginBottom: "6px" }}>
              {isRTL ? "الشهادات والدورات" : "CERTIFICATIONS"}
            </h2>
            <div style={{ height: "2px", background: theme.light, marginBottom: "10px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {certificates.filter(c => c.name).map(cert => (
                <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "12.5px", color: "#111827" }}>{cert.name}</p>
                    {cert.issuer && <p style={{ fontSize: "11.5px", color: "#6b7280" }}>{cert.issuer}</p>}
                  </div>
                  {cert.year && <span style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap" }}>{cert.year}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ─── Print CSS ─── */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body {
            margin: 0 !important; padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .cv-noprint { display: none !important; }
          .cv-page-wrap {
            padding: 0 !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
          }
          .cv-layout-grid { display: block !important; }
          .cv-form-col { display: none !important; }
          .cv-preview-sticky {
            position: static !important;
            top: auto !important;
            width: 100% !important;
          }
          .cv-preview-card {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
            width: 210mm !important;
            page-break-inside: auto;
          }
        }
      `}</style>

      <div className="container py-6 max-w-7xl cv-page-wrap">
        {/* Page Header */}
        <div className="cv-noprint mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                {t("cvBuilder.title")}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{t("cvBuilder.subtitle")}</p>
            </div>

            {/* Controls bar */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Font selector */}
              <Select value={String(fontIdx)} onValueChange={v => setFontIdx(Number(v))}>
                <SelectTrigger className="h-8 w-40 text-xs">
                  <SelectValue placeholder="Font" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((f, i) => (
                    <SelectItem key={f.id} value={String(i)} className="text-xs">{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Color theme picker */}
              <div className="flex items-center gap-1.5 px-2 py-1 border rounded-md bg-background">
                {COLOR_THEMES.map((c, i) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setThemeIdx(i)}
                    className={`h-5 w-5 rounded-full border-2 transition-transform ${i === themeIdx ? "border-foreground scale-110" : "border-transparent"}`}
                    style={{ background: c.header }}
                  />
                ))}
              </div>

              <Button onClick={handlePrint} className="gap-1.5 h-8 text-xs">
                <Printer className="h-3.5 w-3.5" />
                {t("cvBuilder.print")}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
            <Download className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{t("cvBuilder.printTip")}</span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_460px] gap-6 items-start cv-layout-grid">

          {/* ── Left: Form ── */}
          <div className="space-y-3 cv-form-col">

            {/* Personal */}
            <FormSection title={t("cvBuilder.personal")}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">{t("cvBuilder.fullName")}</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">{t("cvBuilder.headline")}</Label>
                  <Input
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    className="mt-1"
                    placeholder={isRTL ? "مثال: مطور ويب أول — Senior Web Developer" : "e.g. Senior Web Developer"}
                  />
                </div>
                <div>
                  <Label className="text-xs">{t("cvBuilder.email")}</Label>
                  <Input value={email} onChange={e => setEmail(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">{t("cvBuilder.phone")}</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">{t("cvBuilder.location")}</Label>
                  <Input value={location} onChange={e => setLocation(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">{t("cvBuilder.linkedin")}</Label>
                  <Input value={linkedin} onChange={e => setLinkedin(e.target.value)} className="mt-1" placeholder="linkedin.com/in/..." />
                </div>
              </div>
            </FormSection>

            {/* Summary */}
            <FormSection title={t("cvBuilder.summary")}>
              <Textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                className="min-h-[80px] text-sm"
                placeholder={t("cvBuilder.summaryPlaceholder")}
              />
            </FormSection>

            {/* Experience */}
            <FormSection title={t("cvBuilder.experience")}>
              <div className="flex justify-end">
                <Button size="sm" variant="outline" onClick={addExp} className="gap-1 h-7 px-2 text-xs">
                  <Plus className="h-3 w-3" />{t("common.add")}
                </Button>
              </div>
              {experiences.map((exp, idx) => (
                <div key={exp.id} className="space-y-2 p-3 border rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{t("cvBuilder.exp")} {idx + 1}</span>
                    {experiences.length > 1 && (
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeExp(exp.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">{t("cvBuilder.jobTitle")}</Label><Input value={exp.title} onChange={e => updateExp(exp.id, "title", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                    <div><Label className="text-xs">{t("cvBuilder.company")}</Label><Input value={exp.company} onChange={e => updateExp(exp.id, "company", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                    <div><Label className="text-xs">{isRTL ? "المدينة" : "City"}</Label><Input value={exp.location} onChange={e => updateExp(exp.id, "location", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                    <div><Label className="text-xs">{t("cvBuilder.period")}</Label><Input value={exp.period} onChange={e => updateExp(exp.id, "period", e.target.value)} className="mt-1 h-8 text-sm" placeholder={isRTL ? "2022 – 2024" : "2022 – 2024"} /></div>
                  </div>
                  <div><Label className="text-xs">{t("cvBuilder.description")}</Label><Textarea value={exp.description} onChange={e => updateExp(exp.id, "description", e.target.value)} className="mt-1 min-h-[56px] text-sm" /></div>
                </div>
              ))}
            </FormSection>

            {/* Education */}
            <FormSection title={t("cvBuilder.education")}>
              <div className="flex justify-end">
                <Button size="sm" variant="outline" onClick={addEdu} className="gap-1 h-7 px-2 text-xs">
                  <Plus className="h-3 w-3" />{t("common.add")}
                </Button>
              </div>
              {educations.map((edu, idx) => (
                <div key={edu.id} className="space-y-2 p-3 border rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{t("cvBuilder.edu")} {idx + 1}</span>
                    {educations.length > 1 && (
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeEdu(edu.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2"><Label className="text-xs">{t("cvBuilder.degree")}</Label><Input value={edu.degree} onChange={e => updateEdu(edu.id, "degree", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                    <div><Label className="text-xs">{t("cvBuilder.institution")}</Label><Input value={edu.institution} onChange={e => updateEdu(edu.id, "institution", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                    <div><Label className="text-xs">{t("cvBuilder.year")}</Label><Input value={edu.year} onChange={e => updateEdu(edu.id, "year", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                  </div>
                </div>
              ))}
            </FormSection>

            {/* Skills */}
            <FormSection title={t("cvBuilder.skills")}>
              <Input
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder={isRTL ? "مثال: JavaScript، React، إدارة المشاريع" : "e.g. JavaScript, React, Project Management"}
              />
              <p className="text-xs text-muted-foreground">{t("cvBuilder.skillsHint")}</p>
            </FormSection>

            {/* Languages */}
            <FormSection title={t("cvBuilder.languages")} defaultOpen={false}>
              <div className="flex justify-end">
                <Button size="sm" variant="outline" onClick={addLang} className="gap-1 h-7 px-2 text-xs">
                  <Plus className="h-3 w-3" />{t("common.add")}
                </Button>
              </div>
              {languages.map((lng, idx) => (
                <div key={lng.id} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/20">
                  <span className="text-xs text-muted-foreground w-5 shrink-0">{idx + 1}</span>
                  <Input value={lng.name} onChange={e => updateLang(lng.id, "name", e.target.value)} className="h-8 text-sm flex-1" placeholder={t("cvBuilder.langName")} />
                  <Select value={lng.level} onValueChange={v => updateLang(lng.id, "level", v)}>
                    <SelectTrigger className="h-8 text-xs w-32 shrink-0">
                      <SelectValue placeholder={t("cvBuilder.langLevel")} />
                    </SelectTrigger>
                    <SelectContent>
                      {["مبتدئ / Beginner", "متوسط / Intermediate", "متقدم / Advanced", "متمكن / Fluent", "أصلي / Native"].map(lv => (
                        <SelectItem key={lv} value={lv} className="text-xs">{lv}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {languages.length > 1 && (
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive shrink-0" onClick={() => removeLang(lng.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </FormSection>

            {/* Certifications */}
            <FormSection title={t("cvBuilder.certificates")} defaultOpen={false}>
              <div className="flex justify-end">
                <Button size="sm" variant="outline" onClick={addCert} className="gap-1 h-7 px-2 text-xs">
                  <Plus className="h-3 w-3" />{t("common.add")}
                </Button>
              </div>
              {certificates.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  {isRTL ? "لا توجد شهادات — اضغط إضافة" : "No certificates yet — click Add"}
                </p>
              )}
              {certificates.map((cert, idx) => (
                <div key={cert.id} className="space-y-2 p-3 border rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{t("cvBuilder.cert")} {idx + 1}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeCert(cert.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2"><Label className="text-xs">{t("cvBuilder.certName")}</Label><Input value={cert.name} onChange={e => updateCert(cert.id, "name", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                    <div><Label className="text-xs">{t("cvBuilder.issuer")}</Label><Input value={cert.issuer} onChange={e => updateCert(cert.id, "issuer", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                    <div><Label className="text-xs">{t("cvBuilder.certYear")}</Label><Input value={cert.year} onChange={e => updateCert(cert.id, "year", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                  </div>
                </div>
              ))}
            </FormSection>
          </div>

          {/* ── Right: Live Preview ── */}
          <div className="cv-preview-sticky lg:sticky lg:top-6">
            <div className="cv-preview-card shadow-xl rounded-xl overflow-hidden border border-gray-100">
              {CVPreview}
            </div>
            <div className="cv-noprint text-center mt-3">
              <Badge variant="outline" className="text-xs text-muted-foreground gap-1">
                <Printer className="h-2.5 w-2.5" />
                {isRTL ? "معاينة مباشرة — ستُطبع بشكل احترافي على A4" : "Live preview — prints professionally on A4"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
