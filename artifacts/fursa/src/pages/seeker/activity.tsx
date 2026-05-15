import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Activity,
  FileText,
  BellRing,
  Bookmark,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar as arLocale, enUS } from "date-fns/locale";

function apiUrl(path: string) {
  const base = (import.meta.env.BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  return `${base}/api/${path}`;
}

async function authFetch(getToken: () => Promise<string | null>, url: string) {
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(url, { headers });
}

interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  employerName: string;
  status: string;
  createdAt: string;
}

interface SavedJob {
  id: number;
  title: string;
  employerName: string;
  createdAt: string;
}

interface JobAlert {
  id: number;
  categories: string[];
  types: string[];
  isActive: boolean;
  createdAt: string;
}

type ActivityItem =
  | { type: "application"; data: Application; ts: Date }
  | { type: "saved"; data: SavedJob; ts: Date }
  | { type: "alert"; data: JobAlert; ts: Date };

function StatusIcon({ status }: { status: string }) {
  if (status === "accepted") return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
  if (status === "rejected") return <XCircle className="h-3.5 w-3.5 text-red-500" />;
  return <Clock className="h-3.5 w-3.5 text-amber-500" />;
}

export default function SeekerActivityPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const { getToken } = useAuth();
  const { data: user } = useGetCurrentUser();
  const locale = lang === "ar" ? arLocale : enUS;

  const { data: applications = [], isLoading: loadingApps } = useQuery<Application[]>({
    queryKey: ["me-applications-activity"],
    queryFn: async () => {
      const res = await authFetch(getToken, apiUrl("me/applications"));
      if (!res.ok) throw new Error();
      return res.json();
    },
    enabled: !!user,
  });

  const { data: saved = [], isLoading: loadingSaved } = useQuery<SavedJob[]>({
    queryKey: ["me-saved-activity"],
    queryFn: async () => {
      const res = await authFetch(getToken, apiUrl("me/saved-jobs"));
      if (!res.ok) throw new Error();
      return res.json();
    },
    enabled: !!user,
  });

  const { data: alerts = [], isLoading: loadingAlerts } = useQuery<JobAlert[]>({
    queryKey: ["me-alerts-activity"],
    queryFn: async () => {
      const res = await authFetch(getToken, apiUrl("me/alerts"));
      if (!res.ok) throw new Error();
      return res.json();
    },
    enabled: !!user,
  });

  const isLoading = loadingApps || loadingSaved || loadingAlerts;

  // Merge all activity into one sorted timeline
  const timeline: ActivityItem[] = [
    ...applications.map((a) => ({ type: "application" as const, data: a, ts: new Date(a.createdAt) })),
    ...saved.map((s) => ({ type: "saved" as const, data: s, ts: new Date(s.createdAt) })),
    ...alerts.map((al) => ({ type: "alert" as const, data: al, ts: new Date(al.createdAt) })),
  ].sort((a, b) => b.ts.getTime() - a.ts.getTime());

  const isEmpty = !isLoading && timeline.length === 0;

  return (
    <div className="container py-8 max-w-3xl">
      <Helmet>
        <title>{lang === "ar" ? "سجل النشاط | فُرصة" : "Activity Log | Fursa"}</title>
      </Helmet>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Activity className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("seeker.activity.title")}</h1>
          <p className="text-muted-foreground mt-0.5">{t("seeker.activity.subtitle")}</p>
        </div>
      </div>

      {/* Summary badges */}
      {!isLoading && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className="gap-1.5">
            <FileText className="h-3 w-3 text-blue-500" />
            {lang === "ar" ? `${applications.length} طلب` : `${applications.length} applications`}
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <Bookmark className="h-3 w-3 text-amber-500" />
            {lang === "ar" ? `${saved.length} محفوظة` : `${saved.length} saved jobs`}
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <BellRing className="h-3 w-3 text-indigo-500" />
            {lang === "ar" ? `${alerts.length} تنبيه` : `${alerts.length} alerts`}
          </Badge>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : isEmpty ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="py-16 text-center">
            <Activity className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">{t("seeker.activity.empty")}</h3>
            <p className="text-muted-foreground text-sm mb-6">{t("seeker.activity.emptyDesc")}</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button asChild variant="outline" size="sm">
                <Link href="/jobs">{lang === "ar" ? "تصفح الوظائف" : "Browse Jobs"}</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/seeker/alerts">{lang === "ar" ? "إعداد تنبيهات" : "Set Up Alerts"}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-0 bottom-0 start-[19px] w-px bg-border/60" />

          <div className="space-y-3">
            {timeline.map((item, idx) => {
              if (item.type === "application") {
                const app = item.data;
                return (
                  <div key={`app-${app.id}`} className="flex gap-4 items-start relative">
                    <div className="relative z-10 flex-shrink-0 mt-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-background">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <Card className="flex-1 hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <StatusIcon status={app.status} />
                              <span className="text-xs text-muted-foreground font-medium">
                                {t("seeker.activity.applied")}
                              </span>
                            </div>
                            <p className="font-semibold text-sm mt-0.5 truncate">{app.jobTitle}</p>
                            <p className="text-xs text-muted-foreground">{app.employerName}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <Badge
                              variant="outline"
                              className={
                                app.status === "accepted"
                                  ? "text-green-700 border-green-200 bg-green-50"
                                  : app.status === "rejected"
                                  ? "text-red-700 border-red-200 bg-red-50"
                                  : "text-amber-700 border-amber-200 bg-amber-50"
                              }
                            >
                              {lang === "ar"
                                ? app.status === "accepted" ? "مقبول" : app.status === "rejected" ? "مرفوض" : "قيد المراجعة"
                                : app.status === "accepted" ? "Accepted" : app.status === "rejected" ? "Rejected" : "Pending"}
                            </Badge>
                            <Link href={`/jobs/${app.jobId}`} className="text-xs text-primary hover:underline flex items-center gap-0.5">
                              {t("seeker.activity.viewJob")} <ExternalLink className="h-2.5 w-2.5" />
                            </Link>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-2">
                          {formatDistanceToNow(item.ts, { addSuffix: true, locale })}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              }

              if (item.type === "saved") {
                const sj = item.data;
                return (
                  <div key={`saved-${sj.id}`} className="flex gap-4 items-start relative">
                    <div className="relative z-10 flex-shrink-0 mt-3">
                      <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center border-2 border-background">
                        <Bookmark className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <Card className="flex-1 hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <span className="text-xs text-muted-foreground font-medium">{t("seeker.activity.saved")}</span>
                            <p className="font-semibold text-sm mt-0.5 truncate">{sj.title}</p>
                            <p className="text-xs text-muted-foreground">{sj.employerName}</p>
                          </div>
                          <Link href={`/jobs/${sj.id}`} className="text-xs text-primary hover:underline flex items-center gap-0.5 shrink-0 mt-1">
                            {t("seeker.activity.viewJob")} <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-2">
                          {formatDistanceToNow(item.ts, { addSuffix: true, locale })}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              }

              if (item.type === "alert") {
                const al = item.data;
                return (
                  <div key={`alert-${al.id}`} className="flex gap-4 items-start relative">
                    <div className="relative z-10 flex-shrink-0 mt-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border-2 border-background">
                        <BellRing className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <Card className="flex-1 hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <span className="text-xs text-muted-foreground font-medium">{t("seeker.activity.alertCreated")}</span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {al.categories.length === 0 ? (
                            <Badge variant="secondary" className="text-xs">{lang === "ar" ? "كل الفئات" : "All Categories"}</Badge>
                          ) : (
                            al.categories.slice(0, 3).map((c) => (
                              <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                            ))
                          )}
                          {al.categories.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{al.categories.length - 3}</Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-2">
                          {formatDistanceToNow(item.ts, { addSuffix: true, locale })}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
