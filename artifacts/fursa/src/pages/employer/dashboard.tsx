import { Link } from "wouter";
import { useGetEmployerDashboard, useGetCurrentUser } from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { ProfileCompletion } from "@/components/ui/ProfileCompletion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  Clock,
  AlertCircle,
  Eye,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";

export default function EmployerDashboard() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;

  const { data: dashboard, isLoading } = useGetEmployerDashboard();
  const { data: currentUser } = useGetCurrentUser();
  const firstName = currentUser?.name?.split(" ")[0] || "";

  if (isLoading) {
    return (
      <div className="container py-8 max-w-6xl px-4 sm:px-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: t("employer.dashboard.statJobs"),
      value: dashboard?.totalJobs || 0,
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: t("employer.dashboard.unread"),
      value: dashboard?.unseenApplications || 0,
      icon: Eye,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: t("employer.dashboard.statApplications"),
      value: dashboard?.totalApplications || 0,
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: t("employer.dashboard.statPending"),
      value: dashboard?.pendingJobs || 0,
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="container py-8 max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {firstName
              ? (lang === "ar" ? `مرحباً، ${firstName}!` : `Welcome, ${firstName}!`)
              : t("employer.dashboard.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("employer.dashboard.subtitle")}
          </p>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/employer/jobs/new">
            {t("employer.dashboard.newJob")}
          </Link>
        </Button>
      </div>

      <ProfileCompletion
        role="employer"
        name={currentUser?.name}
        phone={currentUser?.phone}
        location={currentUser?.location}
        bio={currentUser?.bio}
        website={currentUser?.website}
        profilePath="/employer/profile"
        className="mb-6"
      />

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

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {t("employer.dashboard.recentApps")}
            </h2>
            <Button variant="link" asChild className="text-sm">
              <Link href="/employer/jobs">
                {t("employer.dashboard.manageJobs")}
              </Link>
            </Button>
          </div>

          {dashboard?.recentApplications &&
          dashboard.recentApplications.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recentApplications.map((app) => (
                <Card
                  key={app.id}
                  className={`border-border/50 hover:shadow-sm transition-shadow ${
                    !app.seenByEmployer
                      ? "border-l-4 rtl:border-r-4 rtl:border-l-0 border-l-primary rtl:border-r-primary bg-primary/5"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold truncate">
                            {app.applicantName}
                          </span>
                          {!app.seenByEmployer && (
                            <Badge
                              variant="secondary"
                              className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0"
                            >
                              {t("employer.dashboard.new")}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(app.createdAt), {
                            addSuffix: true,
                            locale,
                          })}
                        </p>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant={!app.seenByEmployer ? "default" : "outline"}
                        className="shrink-0"
                      >
                        <Link href={`/employer/jobs/${app.jobId}/applications`}>
                          {t("employer.dashboard.review")}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <Users className="h-10 w-10 text-muted-foreground opacity-20 mb-3" />
                <p className="font-medium text-muted-foreground">
                  {t("seeker.dashboard.noApplications")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {t("employer.dashboard.topJobs")}
            </h2>
            <Button variant="link" asChild className="text-sm">
              <Link href="/employer/jobs">{t("common.viewAll")}</Link>
            </Button>
          </div>

          {dashboard?.topJobs && dashboard.topJobs.length > 0 ? (
            <div className="space-y-3">
              {dashboard.topJobs.map((job) => (
                <Card
                  key={job.id}
                  className="border-border/50 hover:shadow-sm transition-shadow"
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Link
                          href={`/employer/jobs/${job.id}`}
                          className="font-semibold hover:text-primary transition-colors truncate block"
                        >
                          {job.title}
                        </Link>
                        {job.status === "pending" && (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-800 border-amber-200"
                          >
                            {t("status.pending")}
                          </Badge>
                        )}
                        {job.status === "rejected" && (
                          <Badge
                            variant="destructive"
                            className="bg-red-100 text-red-800 border-red-200"
                          >
                            {t("status.rejected")}
                          </Badge>
                        )}
                        {!job.isOpen && job.status === "approved" && (
                          <Badge variant="secondary">
                            {t("status.closed")}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.applicationsCount}{" "}
                          {t("employer.dashboard.applicantsLabel")}
                        </span>
                        {job.unseenApplicationsCount > 0 && (
                          <span className="flex items-center gap-1 text-primary font-medium">
                            <AlertCircle className="h-4 w-4" />
                            {job.unseenApplicationsCount}{" "}
                            {t("employer.dashboard.unread")}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                    >
                      <Link href={`/employer/jobs/${job.id}`}>
                        {t("employer.jobs.manage")}
                      </Link>
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
                  {t("employer.dashboard.noActiveJobs")}
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/employer/jobs/new">
                    {t("employer.dashboard.newJob")}
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
