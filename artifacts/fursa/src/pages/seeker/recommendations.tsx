import { Helmet } from "react-helmet-async";
import { useAuth } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Building2, Sparkles, ChevronLeft, DollarSign, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

function apiUrl(path: string) {
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
  return `${base}/api/${path}`;
}

function formatSalary(min: number | null, max: number | null, currency: string | null, lng: string) {
  const c = currency || "USD";
  if (min && max) return `${min.toLocaleString()}–${max.toLocaleString()} ${c}`;
  if (min) return `${min.toLocaleString()}+ ${c}`;
  if (max) return `${lng === "ar" ? "حتى" : "Up to"} ${max.toLocaleString()} ${c}`;
  return null;
}

export default function SeekerRecommendations() {
  const { getToken } = useAuth();
  const { lang: appLang } = useLanguageStore();
  const locale = appLang === "ar" ? ar : enUS;

  const { data: recommendations, isLoading } = useQuery<any[]>({
    queryKey: ["me", "recommendations"],
    queryFn: async () => {
      const token = await getToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(apiUrl("me/recommendations"), { headers });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="container py-8 max-w-5xl">
      <Helmet>
        <title>{appLang === "ar" ? "توصيات الوظائف | فُرصة" : "Job Recommendations | Fursa"}</title>
      </Helmet>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/seeker">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-amber-500" />
            {appLang === "ar" ? "وظائف مقترحة لك" : "Recommended for You"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {appLang === "ar"
              ? "وظائف مختارة بناءً على ملفك الشخصي وتاريخ طلباتك"
              : "Jobs selected based on your profile, skills, and application history"}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-2xl" />
          ))}
        </div>
      ) : recommendations && recommendations.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {appLang === "ar" ? `${recommendations.length} وظيفة مقترحة` : `${recommendations.length} recommended jobs`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((job: any) => {
              const salaryStr = job.salaryMin || job.salaryMax
                ? formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, appLang)
                : null;
              return (
                <Card key={job.id} className="flex flex-col h-full hover:shadow-md transition-shadow border-border/50 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600" />
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                        {job.category}
                      </Badge>
                      <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/20 text-[10px] gap-1">
                        <Sparkles className="h-2.5 w-2.5" />
                        {appLang === "ar" ? "مقترح" : "Match"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-1 hover:text-primary transition-colors">
                      <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Building2 className="h-4 w-4 mr-2 ms-2 opacity-70" />
                        <span className="font-medium text-foreground/80">{job.employerName}</span>
                      </div>
                      {job.employerLocation && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4 mr-2 ms-2 opacity-70" />
                          <span className="truncate">{job.employerLocation}</span>
                        </div>
                      )}
                      {salaryStr && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <DollarSign className="h-4 w-4 mr-2 ms-2 opacity-70" />
                          <span className="font-medium text-green-700 dark:text-green-400">{salaryStr}</span>
                        </div>
                      )}
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="h-4 w-4 mr-2 ms-2 opacity-70" />
                        <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale })}</span>
                      </div>
                      {job.tags && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {job.tags.split(/[,،]/).map((t: string) => t.trim()).filter(Boolean).slice(0, 3).map((tag: string) => (
                            <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] rounded bg-muted border border-border/50">
                              <Tag className="h-2.5 w-2.5 opacity-60" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/jobs/${job.id}`}>{appLang === "ar" ? "عرض الوظيفة" : "View Job"}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <div className="py-20 text-center bg-muted/20 rounded-2xl border border-dashed">
          <Sparkles className="h-12 w-12 mx-auto text-amber-400 opacity-40 mb-4" />
          <h3 className="text-lg font-medium mb-2">{appLang === "ar" ? "لا توجد توصيات بعد" : "No recommendations yet"}</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {appLang === "ar"
              ? "أكمل ملفك الشخصي وأضف مهاراتك، وقدّم على بعض الوظائف لنتمكن من اقتراح وظائف مناسبة لك"
              : "Complete your profile, add your skills, and apply to some jobs so we can suggest relevant positions"}
          </p>
          <Button asChild className="mt-6">
            <Link href="/jobs">{appLang === "ar" ? "تصفح الوظائف" : "Browse Jobs"}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
