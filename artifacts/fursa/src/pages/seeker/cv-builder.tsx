import { useState, useRef } from "react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Printer, FileText, Download } from "lucide-react";
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

function uid() {
  return Math.random().toString(36).slice(2);
}

export default function CvBuilderPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const { data: user } = useGetCurrentUser();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [website, setWebsite] = useState(user?.website ?? "");
  const [summary, setSummary] = useState(user?.bio ?? "");
  const [skills, setSkills] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: uid(), title: "", company: "", period: "", description: "" },
  ]);
  const [educations, setEducations] = useState<Education[]>([
    { id: uid(), degree: "", institution: "", year: "" },
  ]);

  const addExp = () =>
    setExperiences((p) => [...p, { id: uid(), title: "", company: "", period: "", description: "" }]);
  const removeExp = (id: string) =>
    setExperiences((p) => p.filter((e) => e.id !== id));
  const updateExp = (id: string, field: keyof Omit<Experience, "id">, val: string) =>
    setExperiences((p) => p.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  const addEdu = () =>
    setEducations((p) => [...p, { id: uid(), degree: "", institution: "", year: "" }]);
  const removeEdu = (id: string) =>
    setEducations((p) => p.filter((e) => e.id !== id));
  const updateEdu = (id: string, field: keyof Omit<Education, "id">, val: string) =>
    setEducations((p) => p.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);

  const handlePrint = () => window.print();

  return (
    <div className="container py-8 max-w-5xl px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            {t("cvBuilder.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("cvBuilder.subtitle")}</p>
        </div>
        <Button onClick={handlePrint} className="gap-2 print:hidden">
          <Printer className="h-4 w-4" />
          {t("cvBuilder.print")}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Form */}
        <div className="space-y-6 print:hidden">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">{t("cvBuilder.personal")}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">{t("cvBuilder.fullName")}</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" /></div>
                <div><Label className="text-xs">{t("cvBuilder.email")}</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" /></div>
                <div><Label className="text-xs">{t("cvBuilder.phone")}</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" /></div>
                <div><Label className="text-xs">{t("cvBuilder.location")}</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1" /></div>
              </div>
              <div><Label className="text-xs">{t("cvBuilder.website")}</Label><Input value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-1" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">{t("cvBuilder.summary")}</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="min-h-[80px]" placeholder={t("cvBuilder.summaryPlaceholder")} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-base">{t("cvBuilder.experience")}</CardTitle>
              <Button size="sm" variant="outline" onClick={addExp} className="gap-1 h-7 px-2 text-xs"><Plus className="h-3 w-3" />{t("common.add")}</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={exp.id} className="space-y-2 p-3 border rounded-lg relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground font-medium">{t("cvBuilder.exp")} {idx + 1}</span>
                    {experiences.length > 1 && <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeExp(exp.id)}><Trash2 className="h-3 w-3" /></Button>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">{t("cvBuilder.jobTitle")}</Label><Input value={exp.title} onChange={(e) => updateExp(exp.id, "title", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                    <div><Label className="text-xs">{t("cvBuilder.company")}</Label><Input value={exp.company} onChange={(e) => updateExp(exp.id, "company", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                  </div>
                  <div><Label className="text-xs">{t("cvBuilder.period")}</Label><Input value={exp.period} onChange={(e) => updateExp(exp.id, "period", e.target.value)} className="mt-1 h-8 text-sm" placeholder={lang === "ar" ? "مثال: 2022 - 2024" : "e.g. 2022 - 2024"} /></div>
                  <div><Label className="text-xs">{t("cvBuilder.description")}</Label><Textarea value={exp.description} onChange={(e) => updateExp(exp.id, "description", e.target.value)} className="mt-1 min-h-[60px] text-sm" /></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-base">{t("cvBuilder.education")}</CardTitle>
              <Button size="sm" variant="outline" onClick={addEdu} className="gap-1 h-7 px-2 text-xs"><Plus className="h-3 w-3" />{t("common.add")}</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {educations.map((edu, idx) => (
                <div key={edu.id} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground font-medium">{t("cvBuilder.edu")} {idx + 1}</span>
                    {educations.length > 1 && <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeEdu(edu.id)}><Trash2 className="h-3 w-3" /></Button>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">{t("cvBuilder.degree")}</Label><Input value={edu.degree} onChange={(e) => updateEdu(edu.id, "degree", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                    <div><Label className="text-xs">{t("cvBuilder.year")}</Label><Input value={edu.year} onChange={(e) => updateEdu(edu.id, "year", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                  </div>
                  <div><Label className="text-xs">{t("cvBuilder.institution")}</Label><Input value={edu.institution} onChange={(e) => updateEdu(edu.id, "institution", e.target.value)} className="mt-1 h-8 text-sm" /></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">{t("cvBuilder.skills")}</CardTitle></CardHeader>
            <CardContent>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder={lang === "ar" ? "مثال: JavaScript، React، إدارة المشاريع" : "e.g. JavaScript, React, Project Management"} />
              <p className="text-xs text-muted-foreground mt-1">{t("cvBuilder.skillsHint")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div id="cv-preview" className="lg:sticky lg:top-6 print:static print:w-full">
          <div className="bg-white text-gray-900 shadow-lg rounded-xl overflow-hidden print:shadow-none print:rounded-none" style={{ fontFamily: "Georgia, serif" }}>
            {/* Header */}
            <div className="bg-primary/90 text-white px-8 py-6 print:bg-primary">
              <h1 className="text-2xl font-bold">{name || (lang === "ar" ? "الاسم الكامل" : "Full Name")}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-sm text-white/80">
                {email && <span>{email}</span>}
                {phone && <span>{phone}</span>}
                {location && <span>{location}</span>}
                {website && <span>{website}</span>}
              </div>
            </div>
            <div className="px-8 py-6 space-y-5">
              {summary && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">{t("cvBuilder.summary")}</h2>
                  <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
                  <Separator className="mt-4" />
                </div>
              )}
              {experiences.some((e) => e.title || e.company) && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">{t("cvBuilder.experience")}</h2>
                  <div className="space-y-4">
                    {experiences.filter((e) => e.title || e.company).map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-sm">{exp.title}</p>
                            <p className="text-sm text-gray-600">{exp.company}</p>
                          </div>
                          {exp.period && <span className="text-xs text-gray-500 shrink-0">{exp.period}</span>}
                        </div>
                        {exp.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              )}
              {educations.some((e) => e.degree || e.institution) && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">{t("cvBuilder.education")}</h2>
                  <div className="space-y-3">
                    {educations.filter((e) => e.degree || e.institution).map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm">{edu.degree}</p>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                        </div>
                        {edu.year && <span className="text-xs text-gray-500 shrink-0">{edu.year}</span>}
                      </div>
                    ))}
                  </div>
                  {skillList.length > 0 && <Separator className="mt-4" />}
                </div>
              )}
              {skillList.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">{t("cvBuilder.skills")}</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {skillList.map((s) => (
                      <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`@media print { .print\\:hidden { display: none !important; } body { background: white; } #cv-preview { position: static; } }`}</style>
    </div>
  );
}
