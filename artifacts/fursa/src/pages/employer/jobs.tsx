import { useState } from "react";
import { Link } from "wouter";
import { useListEmployerJobs, useToggleJobOpen } from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Briefcase,
  Users,
  Plus,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Archive,
  ArchiveRestore,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { getListEmployerJobsQueryKey } from "@workspace/api-client-react";
import { toast } from "sonner";

export default function EmployerJobs() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;
  const queryClient = useQueryClient();
  const [confirmArchive, setConfirmArchive] = useState<{ id: number; title: string } | null>(null);
  const [confirmUnarchive, setConfirmUnarchive] = useState<{ id: number; title: string } | null>(null);

  const { data: allJobs, isLoading } = useListEmployerJobs();

  const activeJobs = allJobs?.filter((j: any) => !j.archivedAt) ?? [];
  const archivedJobs = allJobs?.filter((j: any) => !!j.archivedAt) ?? [];

  const toggleMutation = useToggleJobOpen({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEmployerJobsQueryKey() });
      },
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async ({ id, restore }: { id: number; restore?: boolean }) => {
      const res = await fetch(`/api/employer/jobs/${id}/archive`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restore: restore ?? false }),
      });
      if (!res.ok) throw new Error("failed");
      return res.json();
    },
    onSuccess: (_, { restore }) => {
      queryClient.invalidateQueries({ queryKey: getListEmployerJobsQueryKey() });
      toast.success(
        restore
          ? (lang === "ar" ? "تمت استعادة الوظيفة من الأرشيف" : "Job restored from archive")
          : (lang === "ar" ? "تمت أرشفة الوظيفة بنجاح" : "Job archived successfully"),
      );
    },
    onError: () => toast.error(lang === "ar" ? "حدث خطأ" : "Something went wrong"),
  });

  const getStatusBadge = (status: string, isOpen: boolean) => {
    if (status === "rejected") return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200 flex items-center gap-1">
        <XCircle className="h-3 w-3" /> {t("employer.jobs.statusRejected")}
      </Badge>
    );
    if (status === "pending") return (
      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-1">
        <Clock className="h-3 w-3" /> {t("employer.jobs.statusPending")}
      </Badge>
    );
    if (!isOpen) return (
      <Badge variant="secondary" className="flex items-center gap-1">
        {t("employer.jobs.statusClosed")}
      </Badge>
    );
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" /> {t("employer.jobs.statusActive")}
      </Badge>
    );
  };

  const JobCard = ({ job, archived = false }: { job: any; archived?: boolean }) => (
    <Card
      key={job.id}
      className={`border-border/50 hover:shadow-md transition-all ${
        !archived && job.unseenApplicationsCount > 0
          ? "border-r-4 rtl:border-l-4 rtl:border-r-0 border-r-primary rtl:border-l-primary"
          : archived ? "opacity-75" : ""
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
                {archived
                  ? (lang === "ar" ? "أُرشف " : "Archived ") +
                    formatDistanceToNow(new Date(job.archivedAt), { addSuffix: true, locale })
                  : t("employer.jobs.publishedAt", {
                      date: formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale }),
                    })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block shrink-0">
                {archived
                  ? <Badge variant="outline" className="gap-1 text-muted-foreground"><Archive className="h-3 w-3" />{lang === "ar" ? "مؤرشف" : "Archived"}</Badge>
                  : getStatusBadge(job.status, job.isOpen)}
              </div>
              {/* Actions menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/employer/jobs/${job.id}`}>
                      {lang === "ar" ? "إدارة الوظيفة" : "Manage Job"}
                    </Link>
                  </DropdownMenuItem>
                  {archived ? (
                    <DropdownMenuItem
                      onClick={() => setConfirmUnarchive({ id: job.id, title: job.title })}
                      className="text-emerald-600"
                    >
                      <ArchiveRestore className="h-4 w-4 mr-2 ms-2" />
                      {lang === "ar" ? "استعادة من الأرشيف" : "Restore from Archive"}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => setConfirmArchive({ id: job.id, title: job.title })}
                      className="text-amber-600"
                    >
                      <Archive className="h-4 w-4 mr-2 ms-2" />
                      {lang === "ar" ? "أرشفة الوظيفة" : "Archive Job"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {job.status === "rejected" && job.rejectionReason && (
            <div className="bg-red-50 text-red-800 text-sm p-3 rounded-md mx-2 border border-red-100 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">{t("employer.jobs.rejectionReason")}</span>
                {job.rejectionReason}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 px-2">
            <Badge variant="outline" className="bg-muted/50 border-0">
              {t(`jobs.type.${job.type}`)}
            </Badge>
            <div className="flex items-center text-sm font-medium">
              <Users className="h-4 w-4 mr-2 ms-2 text-muted-foreground" />
              {job.applicationsCount} {t("employer.jobs.applicantsTotal")}
            </div>
            {!archived && job.unseenApplicationsCount > 0 && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                {job.unseenApplicationsCount} {t("employer.jobs.newApplications")}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center justify-between gap-3 shrink-0 md:w-44 border-t md:border-t-0 md:border-r rtl:md:border-l rtl:md:border-r-0 border-border/50 pt-4 md:pt-0 md:ps-4">
          <div className="sm:hidden w-full text-center">
            {archived
              ? <Badge variant="outline" className="gap-1"><Archive className="h-3 w-3" />{lang === "ar" ? "مؤرشف" : "Archived"}</Badge>
              : getStatusBadge(job.status, job.isOpen)}
          </div>

          {!archived && job.status === "approved" && (
            <div className="flex items-center gap-2 w-full justify-between md:justify-start">
              <Label htmlFor={`toggle-${job.id}`} className="text-xs text-muted-foreground cursor-pointer select-none">
                {job.isOpen ? t("employer.jobDetail.acceptingApps") : t("employer.jobs.statusClosed")}
              </Label>
              <Switch
                id={`toggle-${job.id}`}
                checked={job.isOpen}
                onCheckedChange={() => toggleMutation.mutate({ id: job.id })}
                disabled={toggleMutation.isPending}
              />
            </div>
          )}

          {archived ? (
            <Button
              variant="outline"
              className="w-full gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              onClick={() => setConfirmUnarchive({ id: job.id, title: job.title })}
            >
              <ArchiveRestore className="h-4 w-4" />
              {lang === "ar" ? "استعادة" : "Restore"}
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link href={`/employer/jobs/${job.id}`}>{t("employer.jobs.manage")}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full hidden sm:flex">
            <Link href="/employer">
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("employer.jobs.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("employer.jobs.subtitle")}</p>
          </div>
        </div>
        <Button asChild size="lg">
          <Link href="/employer/jobs/new">
            <Plus className="mr-2 ms-2 h-5 w-5" />
            {t("employer.jobs.newJob")}
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="active" className="flex-1 sm:flex-none gap-2">
            <Briefcase className="h-4 w-4" />
            {lang === "ar" ? "الوظائف النشطة" : "Active Jobs"}
            {activeJobs.length > 0 && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{activeJobs.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex-1 sm:flex-none gap-2">
            <Archive className="h-4 w-4" />
            {lang === "ar" ? "الأرشيف" : "Archive"}
            {archivedJobs.length > 0 && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{archivedJobs.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
          ) : activeJobs.length > 0 ? (
            activeJobs.map((job: any) => <JobCard key={job.id} job={job} />)
          ) : (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="p-12 text-center flex flex-col items-center">
                <Briefcase className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t("employer.jobs.empty")}</h3>
                <p className="text-muted-foreground mb-6">{t("employer.jobs.emptyDesc")}</p>
                <Button asChild size="lg">
                  <Link href="/employer/jobs/new">{t("employer.jobs.newJob")}</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
          ) : archivedJobs.length > 0 ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 rounded-lg px-4 py-2.5">
                <Archive className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  {lang === "ar"
                    ? "الوظائف المؤرشفة مخفية عن الباحثين، لكن سجل الطلبات محفوظ بالكامل."
                    : "Archived jobs are hidden from seekers, but all application history is preserved."}
                </span>
              </div>
              {archivedJobs.map((job: any) => <JobCard key={job.id} job={job} archived />)}
            </>
          ) : (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="p-12 text-center flex flex-col items-center">
                <Archive className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {lang === "ar" ? "لا توجد وظائف مؤرشفة" : "No Archived Jobs"}
                </h3>
                <p className="text-muted-foreground">
                  {lang === "ar"
                    ? "عندما تؤرشف وظيفة، ستظهر هنا مع كامل سجل طلباتها."
                    : "When you archive a job, it will appear here with all its application history."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Archive Confirm Dialog */}
      <AlertDialog open={!!confirmArchive} onOpenChange={(v) => !v && setConfirmArchive(null)}>
        <AlertDialogContent dir={lang === "ar" ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-amber-600" />
              {lang === "ar" ? "أرشفة الوظيفة" : "Archive Job"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "ar"
                ? `هل تريد أرشفة وظيفة "${confirmArchive?.title}"؟ ستُخفى عن الباحثين ويُحفظ كامل سجل الطلبات.`
                : `Archive "${confirmArchive?.title}"? It will be hidden from seekers but all application history will be preserved.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === "ar" ? "إلغاء" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-600 hover:bg-amber-700"
              onClick={() => {
                if (confirmArchive) {
                  archiveMutation.mutate({ id: confirmArchive.id });
                  setConfirmArchive(null);
                }
              }}
            >
              {archiveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {lang === "ar" ? "أرشفة" : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Confirm Dialog */}
      <AlertDialog open={!!confirmUnarchive} onOpenChange={(v) => !v && setConfirmUnarchive(null)}>
        <AlertDialogContent dir={lang === "ar" ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ArchiveRestore className="h-5 w-5 text-emerald-600" />
              {lang === "ar" ? "استعادة الوظيفة" : "Restore Job"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "ar"
                ? `هل تريد استعادة وظيفة "${confirmUnarchive?.title}" من الأرشيف؟ ستعود مرئية للباحثين.`
                : `Restore "${confirmUnarchive?.title}" from archive? It will become visible to seekers again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === "ar" ? "إلغاء" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                if (confirmUnarchive) {
                  archiveMutation.mutate({ id: confirmUnarchive.id, restore: true });
                  setConfirmUnarchive(null);
                }
              }}
            >
              {lang === "ar" ? "استعادة" : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
