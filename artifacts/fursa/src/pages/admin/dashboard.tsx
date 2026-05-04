import { useState } from "react";
import { Link } from "wouter";
import { useGetAdminDashboard, useGetCurrentUser } from "@workspace/api-client-react";
import { useAuth } from "@clerk/react";
import { useT } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Briefcase,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Download,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { toast } from "sonner";

export default function AdminDashboard() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;
  const { getToken } = useAuth();
  const [exporting, setExporting] = useState<"users" | "jobs" | null>(null);

  const { data: dashboard, isLoading } = useGetAdminDashboard();
  const { data: currentUser } = useGetCurrentUser();
  const firstName = currentUser?.name?.split(" ")[0] || "";

  const handleExport = async (type: "users" | "jobs") => {
    setExporting(type);
    try {
      const token = await getToken();
      const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${basePath}/api/admin/export/csv?type=${type}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fursa-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setExporting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 max-w-6xl space-y-6">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full mt-8 rounded-xl" />
      </div>
    );
  }

  const statCards = [
    {
      title: t("admin.dashboard.statUsers"),
      value: dashboard?.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: t("admin.dashboard.statJobs"),
      value: dashboard?.totalJobs || 0,
      icon: Briefcase,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      title: t("admin.dashboard.statApplications"),
      value: dashboard?.totalApplications || 0,
      icon: FileText,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: t("admin.dashboard.statPending"),
      value: dashboard?.pendingJobs || 0,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {firstName
              ? (lang === "ar" ? `مرحباً، ${firstName}!` : `Welcome, ${firstName}!`)
              : t("admin.dashboard.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("admin.dashboard.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">
              {t("admin.dashboard.pendingTitle")}
            </h2>
            {dashboard?.pendingJobs && dashboard.pendingJobs > 0 ? (
              <Badge className="bg-amber-500 hover:bg-amber-600">
                {dashboard.pendingJobs}
              </Badge>
            ) : null}
          </div>
          <Button variant="link" asChild className="text-sm">
            <Link href="/admin/jobs">{t("admin.dashboard.viewAllJobs")}</Link>
          </Button>
        </div>

        {dashboard?.recentPendingJobs && dashboard.recentPendingJobs.length > 0 ? (
          <div className="grid gap-4">
            {dashboard.recentPendingJobs.map((job) => (
              <Card
                key={job.id}
                className="border-l-4 rtl:border-r-4 rtl:border-l-0 border-l-amber-500 rtl:border-r-amber-500 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div>
                      <h3 className="text-lg font-bold">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="font-medium text-sm">
                          {job.employerName}
                        </span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-muted-foreground text-sm" dir="ltr">
                          {job.employerEmail}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-muted/50 border-0">
                        {job.category}
                      </Badge>
                      <Badge variant="outline" className="bg-muted/50 border-0">
                        {t(`jobs.type.${job.type}`)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col items-center justify-between gap-2 shrink-0 md:w-32 border-t md:border-t-0 md:border-r rtl:md:border-l rtl:md:border-r-0 border-border/50 pt-4 md:pt-0">
                    <div className="text-xs text-muted-foreground w-full text-center mb-1">
                      {formatDistanceToNow(new Date(job.createdAt), {
                        addSuffix: true,
                        locale,
                      })}
                    </div>
                    <Button asChild size="sm" className="w-full">
                      <Link href="/admin/jobs">
                        {t("admin.dashboard.reviewNow")}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-12 text-center flex flex-col items-center">
              <CheckCircle2 className="h-16 w-16 text-green-500/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("admin.dashboard.noPending")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("admin.dashboard.allReviewed")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-xl shrink-0">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">
                {t("admin.dashboard.manageJobsCard")}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("admin.dashboard.manageJobsDesc")}
              </p>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full border-primary/20 hover:bg-primary/10"
              >
                <Link href="/admin/jobs">
                  {t("admin.dashboard.gotoJobs")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50 border-secondary">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="bg-background p-3 rounded-xl shrink-0 shadow-sm">
              <Users className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">
                {t("admin.dashboard.manageUsersCard")}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("admin.dashboard.manageUsersDesc")}
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/admin/users">
                  {t("admin.dashboard.gotoUsers")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-muted p-2 rounded-lg">
                <Download className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg">{t("admin.export.title")}</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("users")}
                disabled={exporting !== null}
                className="gap-2"
              >
                {exporting === "users" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {t("admin.export.users")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("jobs")}
                disabled={exporting !== null}
                className="gap-2"
              >
                {exporting === "jobs" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {t("admin.export.jobs")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
