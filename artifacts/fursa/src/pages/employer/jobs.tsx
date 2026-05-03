import { Link } from "wouter";
import { useListEmployerJobs, useToggleJobOpen } from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Briefcase,
  Users,
  Plus,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";
import { getListEmployerJobsQueryKey } from "@workspace/api-client-react";

export default function EmployerJobs() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useListEmployerJobs();

  const toggleMutation = useToggleJobOpen({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEmployerJobsQueryKey() });
      },
    },
  });

  const getStatusBadge = (status: string, isOpen: boolean) => {
    if (status === "rejected") {
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200 flex items-center gap-1"
        >
          <XCircle className="h-3 w-3" /> {t("employer.jobs.statusRejected")}
        </Badge>
      );
    }
    if (status === "pending") {
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-1"
        >
          <Clock className="h-3 w-3" /> {t("employer.jobs.statusPending")}
        </Badge>
      );
    }

    if (!isOpen) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          {t("employer.jobs.statusClosed")}
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" />{" "}
        {t("employer.jobs.statusActive")}
      </Badge>
    );
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full hidden sm:flex"
          >
            <Link href="/employer">
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("employer.jobs.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("employer.jobs.subtitle")}
            </p>
          </div>
        </div>
        <Button asChild size="lg">
          <Link href="/employer/jobs/new">
            <Plus className="mr-2 ms-2 h-5 w-5" />
            {t("employer.jobs.newJob")}
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))
        ) : jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <Card
              key={job.id}
              className={`border-border/50 hover:shadow-md transition-all ${
                job.unseenApplicationsCount > 0
                  ? "border-r-4 rtl:border-l-4 rtl:border-r-0 border-r-primary rtl:border-l-primary"
                  : ""
              }`}
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/employer/jobs/${job.id}`}
                        className="text-xl font-bold hover:text-primary transition-colors pr-2"
                      >
                        {job.title}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1 px-2">
                        {t("employer.jobs.publishedAt", {
                          date: formatDistanceToNow(new Date(job.createdAt), {
                            addSuffix: true,
                            locale,
                          }),
                        })}
                      </div>
                    </div>
                    <div className="hidden sm:block shrink-0">
                      {getStatusBadge(job.status, job.isOpen)}
                    </div>
                  </div>

                  {job.status === "rejected" && job.rejectionReason && (
                    <div className="bg-red-50 text-red-800 text-sm p-3 rounded-md mx-2 border border-red-100 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-1">
                          {t("employer.jobs.rejectionReason")}
                        </span>
                        {job.rejectionReason}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 px-2">
                    <Badge
                      variant="outline"
                      className="bg-muted/50 border-0"
                    >
                      {t(`jobs.type.${job.type}`)}
                    </Badge>
                    <div className="flex items-center text-sm font-medium">
                      <Users className="h-4 w-4 mr-2 ms-2 text-muted-foreground" />
                      {job.applicationsCount}{" "}
                      {t("employer.jobs.applicantsTotal")}
                    </div>
                    {job.unseenApplicationsCount > 0 && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                        {job.unseenApplicationsCount}{" "}
                        {t("employer.jobs.newApplications")}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center justify-between gap-3 shrink-0 md:w-44 border-t md:border-t-0 md:border-r rtl:md:border-l rtl:md:border-r-0 border-border/50 pt-4 md:pt-0 md:ps-4">
                  <div className="sm:hidden w-full text-center">
                    {getStatusBadge(job.status, job.isOpen)}
                  </div>

                  {job.status === "approved" && (
                    <div className="flex items-center gap-2 w-full justify-between md:justify-start">
                      <Label
                        htmlFor={`toggle-${job.id}`}
                        className="text-xs text-muted-foreground cursor-pointer select-none"
                      >
                        {job.isOpen
                          ? t("employer.jobDetail.acceptingApps")
                          : t("employer.jobs.statusClosed")}
                      </Label>
                      <Switch
                        id={`toggle-${job.id}`}
                        checked={job.isOpen}
                        onCheckedChange={() =>
                          toggleMutation.mutate({ id: job.id })
                        }
                        disabled={toggleMutation.isPending}
                      />
                    </div>
                  )}

                  <Button asChild className="w-full">
                    <Link href={`/employer/jobs/${job.id}`}>
                      {t("employer.jobs.manage")}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-12 text-center flex flex-col items-center">
              <Briefcase className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("employer.jobs.empty")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("employer.jobs.emptyDesc")}
              </p>
              <Button asChild size="lg">
                <Link href="/employer/jobs/new">
                  {t("employer.jobs.newJob")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
