import { Link } from "wouter";
import { useGetSeekerDashboard, useGetCurrentUser } from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  FileText,
  Bookmark,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";

export default function SeekerDashboard() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;

  const { data: dashboard, isLoading } = useGetSeekerDashboard();
  const { data: currentUser } = useGetCurrentUser();
  const firstName = currentUser?.name?.split(" ")[0] || "";

  if (isLoading) {
    return (
      <div className="container py-8 max-w-5xl space-y-6">
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
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {firstName
              ? (lang === "ar" ? `مرحباً، ${firstName}!` : `Welcome, ${firstName}!`)
              : t("seeker.dashboard.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("seeker.dashboard.welcome")}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/seeker/profile">
            {t("seeker.dashboard.editProfile")}
          </Link>
        </Button>
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

      <div className="grid md:grid-cols-2 gap-8">
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
              {dashboard.recentApplications.map((app) => (
                <Card
                  key={app.id}
                  className="border-border/50 hover:shadow-sm transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <Link
                          href={`/jobs/${app.jobId}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {app.jobTitle}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {app.employerName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(app.createdAt), {
                            addSuffix: true,
                            locale,
                          })}
                        </p>
                      </div>
                      <div>{getStatusBadge(app.status)}</div>
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

          {dashboard?.recommendedJobs &&
          dashboard.recommendedJobs.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recommendedJobs.map((job) => (
                <Card
                  key={job.id}
                  className="border-border/50 hover:shadow-sm transition-shadow"
                >
                  <CardContent className="p-4 flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-semibold hover:text-primary transition-colors truncate block"
                      >
                        {job.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span className="truncate">{job.employerName}</span>
                        <span>•</span>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                          {t(`jobs.type.${job.type}`)}
                        </span>
                      </div>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="shrink-0 bg-primary/5 text-primary hover:bg-primary/10"
                    >
                      <Link href={`/jobs/${job.id}`}>{t("jobs.details")}</Link>
                    </Button>
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
