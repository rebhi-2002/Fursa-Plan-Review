import { useState } from "react";
import { Link } from "wouter";
import { useT, useLanguageStore } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Globe, Briefcase, Search } from "lucide-react";

interface EmployerListItem {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  activeJobsCount: number;
}

export default function EmployersListPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [search, setSearch] = useState("");

  const { data: employers, isLoading } = useQuery<EmployerListItem[]>({
    queryKey: ["public-employers"],
    queryFn: async () => {
      const res = await fetch("/api/public/employers");
      if (!res.ok) throw new Error("Failed to load employers");
      return res.json();
    },
  });

  const filtered = employers?.filter((e) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      (e.location ?? "").toLowerCase().includes(q) ||
      (e.bio ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6 max-w-5xl">
      <div className="relative rounded-2xl overflow-hidden mb-6 sm:mb-8 h-40 md:h-48">
        <img
          src="/img/seekers-hero.png"
          alt={t("employers.title")}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent flex flex-col justify-center px-8 md:px-12">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">{t("employers.title")}</h1>
          <p className="text-white/80 text-sm md:text-base max-w-md">{t("employers.subtitle")}</p>
        </div>
      </div>

      <div className="mb-5 relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("employers.searchPlaceholder")}
          className="ps-9 bg-background"
          dir={lang === "ar" ? "rtl" : "ltr"}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((employer) => (
            <Card key={employer.id} className="border-border/50 hover:shadow-md transition-all">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h2 className="font-bold text-base leading-tight">{employer.name}</h2>
                      <Badge variant="secondary" className="shrink-0 bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                        <Briefcase className="h-3 w-3 me-1" />
                        {t("employers.jobs", { count: employer.activeJobsCount })}
                      </Badge>
                    </div>
                    {employer.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{employer.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                {employer.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{employer.bio}</p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  {employer.website ? (
                    <a
                      href={employer.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 min-w-0 max-w-[160px]"
                    >
                      <Globe className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {employer.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </span>
                    </a>
                  ) : (
                    <span />
                  )}
                  <Button size="sm" variant="outline" className="shrink-0" asChild>
                    <Link href={`/employers/${employer.id}`}>{t("employers.viewProfile")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Building2 className="h-16 w-16 text-muted-foreground opacity-20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("employers.empty")}</h3>
          <p className="text-muted-foreground">{t("employers.emptyDesc")}</p>
        </div>
      )}
    </div>
  );
}
