import { useState, useEffect } from "react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Printer, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}
interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}
interface Language {
  id: string;
  name: string;
  level: string;
}
interface Certificate {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

function uid() {
  return Math.random().toString(36).slice(2);
}

const COLOR_THEMES = [
  { name: "Indigo", header: "#4f46e5", accent: "#4f46e5" },
  { name: "Teal", header: "#0d9488", accent: "#0d9488" },
  { name: "Slate", header: "#334155", accent: "#334155" },
  { name: "Rose", header: "#e11d48", accent: "#e11d48" },
  { name: "Amber", header: "#d97706", accent: "#d97706" },
];

function FormSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <CardHeader className="pb-3 cursor-pointer select-none" onClick={() => setOpen((o) => !o)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [themeIdx, setThemeIdx] = useState(0);

  const [experiences, setExperiences] = useState<Experience[]>([
    { id: uid(), title: "", company: "", period: "", description: "" },
  ]);
  const [educations, setEducations] = useState<Education[]>([
    { id: uid(), degree: "", institution: "", year: "" },
  ]);
  const [languages, setLanguages] = useState<Language[]>([
    { id: uid(), name: "", level: "" },
  ]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Pre-fill from user profile once loaded
  useEffect(() => {
    if (user) {
      if (user.name && !name) setName(user.name);
      if (user.email && !email) setEmail(user.email);
      if (user.phone && !phone) setPhone(user.phone ?? "");
      if (user.location && !location) setLocation(user.location ?? "");
      if (user.website && !linkedin) setLinkedin(user.website ?? "");
      if (user.bio && !summary) setSummary(user.bio ?? "");
    }
  }, [user]);

  // Helpers — Experiences
  const addExp = () => setExperiences((p) => [...p, { id: uid(), title: "", company: "", period: "", description: "" }]);
  const removeExp = (id: string) => setExperiences((p) => p.filter((e) => e.id !== id));
  const updateExp = (id: string, field: keyof Omit<Experience, "id">, val: string) =>
    setExperiences((p) => p.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  // Helpers — Education
  const addEdu = () => setEducations((p) => [...p, { id: uid(), degree: "", institution: "", year: "" }]);
  const removeEdu = (id: string) => setEducations((p) => p.filter((e) => e.id !== id));
  const updateEdu = (id: string, field: keyof Omit<Education, "id">, val: string) =>
    setEducations((p) => p.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  // Helpers — Languages
  const addLang = () => setLanguages((p) => [...p, { id: uid(), name: "", level: "" }]);
  const removeLang = (id: string) => setLanguages((p) => p.filter((e) => e.id !== id));
  const updateLang = (id: string, field: keyof Omit<Language, "id">, val: string) =>
    setLanguages((p) => p.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  // Helpers — Certificates
  const addCert = () => setCertificates((p) => [...p, { id: uid(), name: "", issuer: "", year: "" }]);
  const removeCert = (id: string) => setCertificates((p) => p.filter((e) => e.id !== id));
  const updateCert = (id: string, field: keyof Omit<Certificate, "id">, val: string) =>
    setCertificates((p) => p.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
  const theme = COLOR_THEMES[themeIdx];
  const isRTL = lang === "ar";

  const handlePrint = () => window.print();

  return (
    <>
      {/* ─── Print CSS ─── */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-hidden { display: none !important; }
          .print-root {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          #cv-preview {
            position: static !important;
            width: 210mm !important;
            min-height: 297mm !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="print-root">
        {/* Page header — hidden on print */}
        <div className="container py-8 max-w-6xl print-hidden">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <FileText className="h-7 w-7 text-primary" />
                {t("cvBuilder.title")}
              </h1>
              <p className="text-muted-foreground mt-1">{t("cvBuilder.subtitle")}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Color theme picker */}
              <div className="flex items-center gap-1.5">
                {COLOR_THEMES.map((c, i) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setThemeIdx(i)}
                    className={`h-6 w-6 rounded-full border-2 transition-all ${i === themeIdx ? "border-foreground scale-110" : "border-transparent"}`}
                    style={{ background: c.header }}
                  />
                ))}
              </div>
              <Button onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                {t("cvBuilder.print")}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-8 print-hidden">
            💡 {t("cvBuilder.printTip")}
          </p>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-[1fr_480px] gap-8 items-start">
            {/* Left: Form */}
            <div className="space-y-4 print-hidden">
              {/* Personal */}
              <FormSection title={t("cvBuilder.personal")}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">{t("cvBuilder.fullName")}</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">{t("cvBuilder.email")}</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">{t("cvBuilder.phone")}</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">{t("cvBuilder.location")}</Label>
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">{t("cvBuilder.linkedin")}</Label>
                  <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="mt-1" placeholder="linkedin.com/in/yourname" />
                </div>
              </FormSection>

              {/* Summary */}
              <FormSection title={t("cvBuilder.summary")}>
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="min-h-[80px]"
                  placeholder={t("cvBuilder.summaryPlaceholder")}
                />
              </FormSection>

              {/* Experience */}
              <FormSection title={t("cvBuilder.experience")}>
                <div className="flex justify-end mb-1">
                  <Button size="sm" variant="outline" onClick={addExp} className="gap-1 h-7 px-2 text-xs">
                    <Plus className="h-3 w-3" />{t("common.add")}
                  </Button>
                </div>
                {experiences.map((exp, idx) => (
                  <div key={exp.id} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">{t("cvBuilder.exp")} {idx + 1}</span>
                      {experiences.length > 1 && (
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeExp(exp.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-xs">{t("cvBuilder.jobTitle")}</Label><Input value={exp.title} onChange={(e) => updateExp(exp.id, "title", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                      <div><Label className="text-xs">{t("cvBuilder.company")}</Label><Input value={exp.company} onChange={(e) => updateExp(exp.id, "company", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                    </div>
                    <div><Label className="text-xs">{t("cvBuilder.period")}</Label><Input value={exp.period} onChange={(e) => updateExp(exp.id, "period", e.target.value)} className="mt-1 h-8 text-sm" placeholder={isRTL ? "مثال: 2022 – 2024" : "e.g. 2022 – 2024"} /></div>
                    <div><Label className="text-xs">{t("cvBuilder.description")}</Label><Textarea value={exp.description} onChange={(e) => updateExp(exp.id, "description", e.target.value)} className="mt-1 min-h-[56px] text-sm" /></div>
                  </div>
                ))}
              </FormSection>

              {/* Education */}
              <FormSection title={t("cvBuilder.education")}>
                <div className="flex justify-end mb-1">
                  <Button size="sm" variant="outline" onClick={addEdu} className="gap-1 h-7 px-2 text-xs">
                    <Plus className="h-3 w-3" />{t("common.add")}
                  </Button>
                </div>
                {educations.map((edu, idx) => (
                  <div key={edu.id} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">{t("cvBuilder.edu")} {idx + 1}</span>
                      {educations.length > 1 && (
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeEdu(edu.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-xs">{t("cvBuilder.degree")}</Label><Input value={edu.degree} onChange={(e) => updateEdu(edu.id, "degree", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                      <div><Label className="text-xs">{t("cvBuilder.year")}</Label><Input value={edu.year} onChange={(e) => updateEdu(edu.id, "year", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                    </div>
                    <div><Label className="text-xs">{t("cvBuilder.institution")}</Label><Input value={edu.institution} onChange={(e) => updateEdu(edu.id, "institution", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                  </div>
                ))}
              </FormSection>

              {/* Skills */}
              <FormSection title={t("cvBuilder.skills")}>
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder={isRTL ? "مثال: JavaScript، React، إدارة المشاريع" : "e.g. JavaScript, React, Project Management"}
                />
                <p className="text-xs text-muted-foreground">{t("cvBuilder.skillsHint")}</p>
              </FormSection>

              {/* Languages */}
              <FormSection title={t("cvBuilder.languages")} defaultOpen={false}>
                <div className="flex justify-end mb-1">
                  <Button size="sm" variant="outline" onClick={addLang} className="gap-1 h-7 px-2 text-xs">
                    <Plus className="h-3 w-3" />{t("common.add")}
                  </Button>
                </div>
                {languages.map((lang_, idx) => (
                  <div key={lang_.id} className="flex items-center gap-2 p-2 border rounded-lg">
                    <span className="text-xs text-muted-foreground w-5 shrink-0">{idx + 1}</span>
                    <Input
                      value={lang_.name}
                      onChange={(e) => updateLang(lang_.id, "name", e.target.value)}
                      className="h-8 text-sm flex-1"
                      placeholder={t("cvBuilder.langName")}
                    />
                    <Input
                      value={lang_.level}
                      onChange={(e) => updateLang(lang_.id, "level", e.target.value)}
                      className="h-8 text-sm flex-1"
                      placeholder={t("cvBuilder.langLevel")}
                    />
                    {languages.length > 1 && (
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive shrink-0" onClick={() => removeLang(lang_.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </FormSection>

              {/* Certificates */}
              <FormSection title={t("cvBuilder.certificates")} defaultOpen={false}>
                <div className="flex justify-end mb-1">
                  <Button size="sm" variant="outline" onClick={addCert} className="gap-1 h-7 px-2 text-xs">
                    <Plus className="h-3 w-3" />{t("common.add")}
                  </Button>
                </div>
                {certificates.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">{isRTL ? "لا توجد شهادات بعد — اضغط إضافة" : "No certificates yet — click Add"}</p>
                )}
                {certificates.map((cert, idx) => (
                  <div key={cert.id} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">{t("cvBuilder.cert")} {idx + 1}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeCert(cert.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-xs">{t("cvBuilder.certName")}</Label><Input value={cert.name} onChange={(e) => updateCert(cert.id, "name", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                      <div><Label className="text-xs">{t("cvBuilder.certYear")}</Label><Input value={cert.year} onChange={(e) => updateCert(cert.id, "year", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                    </div>
                    <div><Label className="text-xs">{t("cvBuilder.issuer")}</Label><Input value={cert.issuer} onChange={(e) => updateCert(cert.id, "issuer", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                  </div>
                ))}
              </FormSection>
            </div>

            {/* Right: Live Preview */}
            <div id="cv-preview" className="lg:sticky lg:top-6">
              <div
                className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif", direction: "ltr" }}
              >
                {/* CV Header */}
                <div
                  className="px-8 py-7"
                  style={{ background: theme.header }}
                >
                  <h1 className="text-[22px] font-bold text-white leading-tight">
                    {name || (isRTL ? "الاسم الكامل" : "Full Name")}
                  </h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-sm text-white/80">
                    {email && <span>{email}</span>}
                    {phone && <span dir="ltr">{phone}</span>}
                    {location && <span>{location}</span>}
                    {linkedin && <span>{linkedin.replace(/^https?:\/\//, "")}</span>}
                  </div>
                </div>

                {/* CV Body */}
                <div className="px-8 py-6 space-y-5 bg-white">
                  {/* Summary */}
                  {summary && (
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: theme.accent }}>
                        {t("cvBuilder.summary")}
                      </h2>
                      <p className="text-[13px] leading-relaxed text-gray-700">{summary}</p>
                      <Separator className="mt-4" />
                    </div>
                  )}

                  {/* Experience */}
                  {experiences.some((e) => e.title || e.company) && (
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: theme.accent }}>
                        {t("cvBuilder.experience")}
                      </h2>
                      <div className="space-y-4">
                        {experiences.filter((e) => e.title || e.company).map((exp) => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <p className="font-bold text-[13px] text-gray-900">{exp.title}</p>
                                <p className="text-[12px] text-gray-600 font-medium">{exp.company}</p>
                              </div>
                              {exp.period && (
                                <span className="text-[11px] text-gray-500 shrink-0 mt-0.5">{exp.period}</span>
                              )}
                            </div>
                            {exp.description && (
                              <p className="text-[12px] text-gray-600 mt-1.5 leading-relaxed">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  )}

                  {/* Education */}
                  {educations.some((e) => e.degree || e.institution) && (
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: theme.accent }}>
                        {t("cvBuilder.education")}
                      </h2>
                      <div className="space-y-3">
                        {educations.filter((e) => e.degree || e.institution).map((edu) => (
                          <div key={edu.id} className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-bold text-[13px] text-gray-900">{edu.degree}</p>
                              <p className="text-[12px] text-gray-600">{edu.institution}</p>
                            </div>
                            {edu.year && <span className="text-[11px] text-gray-500 shrink-0 mt-0.5">{edu.year}</span>}
                          </div>
                        ))}
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  )}

                  {/* Skills */}
                  {skillList.length > 0 && (
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: theme.accent }}>
                        {t("cvBuilder.skills")}
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {skillList.map((s) => (
                          <span
                            key={s}
                            className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                            style={{ background: theme.accent + "18", color: theme.accent }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      {(languages.some((l) => l.name) || certificates.some((c) => c.name)) && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  )}

                  {/* Languages */}
                  {languages.some((l) => l.name) && (
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: theme.accent }}>
                        {t("cvBuilder.languages")}
                      </h2>
                      <div className="grid grid-cols-2 gap-1.5">
                        {languages.filter((l) => l.name).map((l) => (
                          <div key={l.id} className="flex items-center justify-between">
                            <span className="text-[12px] font-medium text-gray-800">{l.name}</span>
                            {l.level && <span className="text-[11px] text-gray-500">{l.level}</span>}
                          </div>
                        ))}
                      </div>
                      {certificates.some((c) => c.name) && <Separator className="mt-4" />}
                    </div>
                  )}

                  {/* Certificates */}
                  {certificates.some((c) => c.name) && (
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: theme.accent }}>
                        {t("cvBuilder.certificates")}
                      </h2>
                      <div className="space-y-2">
                        {certificates.filter((c) => c.name).map((cert) => (
                          <div key={cert.id} className="flex justify-between items-start gap-2">
                            <div>
                              <p className="text-[12px] font-bold text-gray-900">{cert.name}</p>
                              {cert.issuer && <p className="text-[11px] text-gray-600">{cert.issuer}</p>}
                            </div>
                            {cert.year && <span className="text-[11px] text-gray-500 shrink-0 mt-0.5">{cert.year}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview label */}
              <div className="text-center mt-3 print-hidden">
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  {isRTL ? "معاينة مباشرة — ستُطبع هذه النسخة" : "Live preview — this will be printed"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
