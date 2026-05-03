import { useState } from "react";
import { Link } from "wouter";
import {
  useListMyApplications,
  useWithdrawApplication,
  getListMyApplicationsQueryKey,
} from "@workspace/api-client-react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  Building2,
  Calendar,
  FileText,
  Trash2,
  Pencil,
  Phone,
  X,
  Check,
  Loader2,
} from "lucide-react";
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
import { toast } from "sonner";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

const PAGE_SIZE = 8;

export default function SeekerApplications() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;
  const queryClient = useQueryClient();
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const { data: applications, isLoading } = useListMyApplications();

  const withdrawMutation = useWithdrawApplication({
    mutation: {
      onSuccess: () => {
        toast.success(t("seeker.applications.withdrawSuccess"));
        queryClient.invalidateQueries({ queryKey: getListMyApplicationsQueryKey() });
      },
      onError: () => {
        toast.error(t("common.error"));
      },
    },
  });

  const [confirmWithdrawId, setConfirmWithdrawId] = useState<number | null>(null);
  const [confirmWithdrawTitle, setConfirmWithdrawTitle] = useState("");

  const openWithdrawConfirm = (id: number, title: string) => {
    setConfirmWithdrawId(id);
    setConfirmWithdrawTitle(title);
  };

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCoverLetter, setEditCoverLetter] = useState("");

  const editMutation = useMutation({
    mutationFn: async ({ id, coverLetter }: { id: number; coverLetter: string }) => {
      const res = await fetch(`/api/me/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      });
      if (!res.ok) throw new Error("Failed to edit");
    },
    onSuccess: () => {
      toast.success(t("seeker.applications.editSuccess"));
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: getListMyApplicationsQueryKey() });
    },
    onError: () => {
      toast.error(t("common.error"));
    },
  });

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
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
            {t("status.rejected")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
            {t("status.pending")}
          </Badge>
        );
    }
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/seeker">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("seeker.applications.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("seeker.applications.subtitle")}</p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))
        ) : applications && applications.length > 0 ? (
          <>
          {(applications as any[]).slice(0, displayCount).map((app) => (
            <Card key={app.id} className="border-border/50 hover:shadow-md transition-all">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div>
                      <Link href={`/jobs/${app.jobId}`} className="text-lg font-bold hover:text-primary transition-colors">
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
                          date: format(new Date(app.createdAt), "PPP", { locale }),
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                    {getStatusBadge(app.status)}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/jobs/${app.jobId}`}>{t("seeker.applications.viewJob")}</Link>
                      </Button>
                      {app.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => {
                              setEditingId(app.id);
                              setEditCoverLetter(app.coverLetter || "");
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-1 ms-1" />
                            {t("seeker.applications.edit")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => openWithdrawConfirm(app.id, app.jobTitle)}
                            disabled={withdrawMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-1 ms-1" />
                            {t("seeker.applications.withdraw")}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {editingId === app.id && (
                  <div className="border-t pt-4 space-y-3">
                    <p className="text-sm font-medium">{t("seeker.applications.editLabel")}</p>
                    <Textarea
                      value={editCoverLetter}
                      onChange={(e) => setEditCoverLetter(e.target.value)}
                      className="min-h-[100px] resize-none bg-background"
                      placeholder={t("seeker.applications.coverLetterPlaceholder")}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4 mr-1 ms-1" />{t("common.cancel")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => editMutation.mutate({ id: app.id, coverLetter: editCoverLetter })}
                        disabled={editMutation.isPending}
                      >
                        {editMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-1 ms-1 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-1 ms-1" />
                        )}
                        {t("common.save")}
                      </Button>
                    </div>
                  </div>
                )}

                {app.status === "accepted" && app.contactInfo && (
                  <div className="border-t pt-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <Phone className="h-5 w-5 text-green-700 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800 mb-1">
                          {t("seeker.applications.contactInfoTitle")}
                        </p>
                        <p className="text-sm text-green-700 whitespace-pre-wrap">{app.contactInfo}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {displayCount < (applications as any[]).length && (
            <div className="flex flex-col items-center gap-2 pt-2">
              <p className="text-sm text-muted-foreground">
                {t("common.showingOf", { shown: Math.min(displayCount, (applications as any[]).length), total: (applications as any[]).length })}
              </p>
              <Button
                variant="outline"
                onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
                className="w-full max-w-xs"
              >
                {t("common.loadMore")}
              </Button>
            </div>
          )}
          </>
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-12 text-center flex flex-col items-center">
              <FileText className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("seeker.applications.empty")}</h3>
              <p className="text-muted-foreground mb-6">{t("seeker.applications.emptyDesc")}</p>
              <Button asChild size="lg">
                <Link href="/jobs">{t("seeker.applications.browse")}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog
        open={confirmWithdrawId !== null}
        onOpenChange={(open) => { if (!open) setConfirmWithdrawId(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("seeker.applications.withdrawConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("seeker.applications.withdrawConfirmDesc", { title: confirmWithdrawTitle })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (confirmWithdrawId !== null) {
                  withdrawMutation.mutate({ id: confirmWithdrawId });
                }
              }}
            >
              {t("seeker.applications.withdrawConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
