import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { useGetSeekerDashboard, useGetCurrentUser } from "@workspace/api-client-react";
import { OnboardingTour } from "@/components/ui/OnboardingTour";
import { InvitationsPanel } from "@/components/seeker/InvitationsPanel";
import { useT } from "@/lib/i18n";
import { ProfileCompletion } from "@/components/ui/ProfileCompletion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  FileText,
  Bookmark,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  Settings,
  Bell,
  FileCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function SeekerDashboard() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;

  const { data: dashboard, isLoading } = useGetSeekerDashboard();
  const { data: currentUser } = useGetCurrentUser();
  const firstName = currentUser?.name?.split(" ")[0] || "";

  type StatMonth = { month: string; labelAr: string; labelEn: string; submitted: number; accepted: number; rejected: number };
  const { data: appStats } = useQuery<StatMonth[]>({
    queryKey: ["application-stats"],
    queryFn: async () => {
      const res = await fetch("/api/me/application-stats", { credentials: "include" });
      if (!res.ok) return [];
      return res.json() as Promise<StatMonth[]>;
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-full py-8 max-w-5xl px-4 sm:px-6 space-y-6">
      <Helmet>
        <title>{lang === "ar" ? "لوحتي | فُرصة" : "My Dashboard | Fursa"}</title>
      </Helmet>
        <h1 className="text-3xl font-bold mb-6">
          {t("seeker.dashboard.title")}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: t("seeker.dashboard.statApplications"),
      value: dashboard?.totalApplications || 0,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: t("status.pending"),
      value: dashboard?.pendingApplications || 0,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: t("seeker.dashboard.statAccepted"),
      value: dashboard?.acceptedApplications || 0,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: t("seeker.dashboard.statSaved"),
      value: dashboard?.savedJobsCount || 0,
      icon: Bookmark,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            {t("status.accepted")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
          >
            {t("status.rejected")}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-800 border-amber-200"
          >
            {t("status.pending")}
          </Badge>
        );
    }
  };

  return (
    <div className="mx-auto w-full py-8 max-w-5xl px-4 sm:px-6">
      <OnboardingTour role="seeker" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-2xl sm:text-3xl font-bold tracking-tight truncate">
            {firstName
              ? (lang === "ar" ? `مرحباً، ${firstName}!` : `Welcome, ${firstName}!`)
              : t("seeker.dashboard.title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("seeker.dashboard.welcome")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Link href="/seeker/recommendations">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              {lang === "ar" ? "مقترح لك" : "Recommended"}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Link href="/seeker/alerts">
              <Bell className="h-3.5 w-3.5" />
              {lang === "ar" ? "تنبيهاتي" : "Alerts"}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Link href="/seeker/cv-builder">
              <FileCheck className="h-3.5 w-3.5" />
              {lang === "ar" ? "بناء السيرة" : "CV Builder"}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Link href="/seeker/profile">
              {t("seeker.dashboard.editProfile")}
            </Link>
          </Button>
        </div>
      </div>

      <ProfileCompletion
        role="seeker"
        name={currentUser?.name}
        phone={currentUser?.phone}
        location={currentUser?.location}
        bio={currentUser?.bio}
        cvObjectPath={currentUser?.cvObjectPath}
        profilePath="/seeker/profile"
        className="mb-6"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm">
            <CardContent className="p-3 sm:p-5">
              <div className="flex items-start justify-between gap-1 pb-2">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight min-w-0 break-words">
                  {stat.title}
                </p>
                <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${stat.bg}`}>
                  <stat.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {appStats && appStats.some((m) => m.submitted > 0) && (
        <Card className="mb-8 border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{t("seeker.dashboard.chartTitle")}</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">{t("seeker.dashboard.chartSubtitle")}</p>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={appStats.map((m) => ({
                  ...m,
                  label: lang === "ar" ? m.labelAr : m.labelEn,
                }))}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                barSize={16}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  reversed={lang === "ar"}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  formatter={(value) => {
                    if (value === "submitted") return t("seeker.dashboard.chartSubmitted");
                    if (value === "accepted") return t("seeker.dashboard.chartAccepted");
                    if (value === "rejected") return t("seeker.dashboard.chartRejected");
                    return value;
                  }}
                />
                <Bar dataKey="submitted" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="accepted" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {t("seeker.dashboard.recentApplications")}
            </h2>
            <Button variant="link" asChild className="text-sm">
              <Link href="/seeker/applications">{t("common.viewAll")}</Link>
            </Button>
          </div>

          {dashboard?.recentApplications &&
          dashboard.recentApplications.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recentApplications.map((app: any) => (
                <Card
                  key={app.id}
                  className="border-border/50 hover:shadow-sm transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/jobs/${app.jobId}`}
                          className="font-semibold hover:text-primary transition-colors truncate block"
                        >
                          {app.jobTitle}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {app.employerName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(app.createdAt), {
                            addSuffix: true,
                            locale,
                          })}
                        </p>
                      </div>
                      <div className="shrink-0">{getStatusBadge(app.status)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <FileText className="h-10 w-10 text-muted-foreground opacity-20 mb-3" />
                <p className="font-medium text-muted-foreground">
                  {t("seeker.dashboard.noApplications")}
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/jobs">{t("home.viewAllJobs")}</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {t("seeker.dashboard.recommendedJobs")}
            </h2>
            <Button variant="link" asChild className="text-sm">
              <Link href="/jobs">{t("common.viewAll")}</Link>
            </Button>
          </div>

          <InvitationsPanel />

          {dashboard?.recommendedJobs &&
          dashboard.recommendedJobs.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recommendedJobs.map((job: any) => (
                <Card
                  key={job.id}
                  className="border-border/50 hover:shadow-sm transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="font-semibold hover:text-primary transition-colors truncate block"
                        >
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-1.5 flex-wrap mt-1 text-sm text-muted-foreground min-w-0">
                          <span className="truncate max-w-[140px]">{job.employerName}</span>
                          <span className="shrink-0">•</span>
                          <span className="text-xs px-2 py-0.5 bg-muted rounded-full shrink-0">
                            {t(`jobs.type.${job.type}`)}
                          </span>
                        </div>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="shrink-0 bg-primary/5 text-primary hover:bg-primary/10 mt-0.5"
                      >
                        <Link href={`/jobs/${job.id}`}>{t("jobs.details")}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <Briefcase className="h-10 w-10 text-muted-foreground opacity-20 mb-3" />
                <p className="font-medium text-muted-foreground">
                  {t("seeker.dashboard.completeProfile")}
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/seeker/profile">
                    {t("seeker.dashboard.completeProfileBtn")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
