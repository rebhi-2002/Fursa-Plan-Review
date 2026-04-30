import { Link } from "wouter";
import {
  useListSavedJobs,
  useUnsaveJob,
  getListSavedJobsQueryKey,
} from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bookmark,
  BookmarkMinus,
  Building2,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function SeekerSavedJobs() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;
  const queryClient = useQueryClient();

  const { data: savedJobs, isLoading } = useListSavedJobs();

  const unsaveMutation = useUnsaveJob({
    mutation: {
      onSuccess: () => {
        toast.success(t("jobs.unsave"));
        queryClient.invalidateQueries({
          queryKey: getListSavedJobsQueryKey(),
        });
      },
    },
  });

  const handleUnsave = (jobId: number) => {
    unsaveMutation.mutate({ data: { jobId } });
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
            {t("seeker.saved.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("seeker.saved.subtitle")}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))
        ) : savedJobs && savedJobs.length > 0 ? (
          savedJobs.map((job) => (
            <Card
              key={job.id}
              className="border-border/50 hover:shadow-md transition-all group"
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-lg font-bold hover:text-primary transition-colors truncate block"
                    >
                      {job.title}
                    </Link>
                    <Badge
                      variant="outline"
                      className="shrink-0 bg-primary/5 text-primary border-primary/20"
                    >
                      {t(`jobs.type.${job.type}`)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 ms-2 opacity-70" />
                      {job.employerName}
                    </div>
                    {job.employerLocation && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 ms-2 opacity-70" />
                        {job.employerLocation}
                      </div>
                    )}
                    <div className="text-xs bg-muted px-2 py-1 rounded-md">
                      {t("seeker.saved.publishedAt", {
                        ago: formatDistanceToNow(new Date(job.createdAt), {
                          addSuffix: true,
                          locale,
                        }),
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center justify-between gap-2 shrink-0 border-t md:border-t-0 md:border-r rtl:md:border-l rtl:md:border-r-0 border-border/50 pt-4 md:pt-0 md:pr-4 rtl:md:pl-4 rtl:md:pr-0">
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/jobs/${job.id}`}>
                      {t("seeker.saved.view")}
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleUnsave(job.id)}
                    disabled={unsaveMutation.isPending}
                  >
                    <BookmarkMinus className="h-4 w-4 mr-2 ms-2" />
                    {t("seeker.saved.remove")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-12 text-center flex flex-col items-center">
              <Bookmark className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("seeker.saved.empty")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("seeker.saved.emptyDesc")}
              </p>
              <Button asChild size="lg" variant="outline">
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
