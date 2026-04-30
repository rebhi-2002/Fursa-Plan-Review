import { Link } from "wouter";
import { useListMyApplications } from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Building2, Calendar, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";

export default function SeekerApplications() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;

  const { data: applications, isLoading } = useListMyApplications();

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
    <div className="container py-8 max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-full"
        >
          <Link href="/seeker">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("seeker.applications.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("seeker.applications.subtitle")}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))
        ) : applications && applications.length > 0 ? (
          applications.map((app) => (
            <Card
              key={app.id}
              className="border-border/50 hover:shadow-md transition-all"
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <Link
                      href={`/jobs/${app.jobId}`}
                      className="text-lg font-bold hover:text-primary transition-colors"
                    >
                      {app.jobTitle}
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 ms-2 opacity-70" />
                      {app.employerName}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 ms-2 opacity-70" />
                      {t("seeker.applications.appliedOn", {
                        date: format(new Date(app.createdAt), "PPP", {
                          locale,
                        }),
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                  {getStatusBadge(app.status)}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/jobs/${app.jobId}`}>
                      {t("seeker.applications.viewJob")}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-12 text-center flex flex-col items-center">
              <FileText className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("seeker.applications.empty")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("seeker.applications.emptyDesc")}
              </p>
              <Button asChild size="lg">
                <Link href="/jobs">
                  {t("seeker.applications.browse")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
