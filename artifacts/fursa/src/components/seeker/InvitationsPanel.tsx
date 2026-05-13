import { Link } from "wouter";
import { useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UserPlus,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface Invitation {
  id: number;
  status: "pending" | "accepted" | "declined";
  message?: string | null;
  createdAt: string;
  jobId: number;
  jobTitle: string;
  jobCategory: string;
  jobType: string;
  employerName: string;
}

export function InvitationsPanel() {
  const { lang } = useLanguageStore();
  const qc = useQueryClient();
  const locale = lang === "ar" ? ar : enUS;

  const { data: invitations = [], isLoading } = useQuery<Invitation[]>({
    queryKey: ["my-invitations"],
    queryFn: async () => {
      const res = await fetch("/api/me/invitations", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  const respondMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "accepted" | "declined" }) => {
      const res = await fetch(`/api/me/invitations/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("failed");
      return res.json();
    },
    onSuccess: (_, { status }) => {
      qc.invalidateQueries({ queryKey: ["my-invitations"] });
      toast.success(
        status === "accepted"
          ? (lang === "ar" ? "تم قبول الدعوة!" : "Invitation accepted!")
          : (lang === "ar" ? "تم رفض الدعوة" : "Invitation declined"),
      );
    },
    onError: () => toast.error(lang === "ar" ? "حدث خطأ" : "Something went wrong"),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            {lang === "ar" ? "الدعوات الواردة" : "Job Invitations"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </CardContent>
      </Card>
    );
  }

  if (invitations.length === 0) return null;

  const pending = invitations.filter((i) => i.status === "pending");
  const responded = invitations.filter((i) => i.status !== "pending");

  const typeLabel = (type: string) =>
    type === "online"
      ? (lang === "ar" ? "عن بُعد" : "Remote")
      : type === "field"
      ? (lang === "ar" ? "ميداني" : "On-site")
      : (lang === "ar" ? "هجين" : "Hybrid");

  const statusIcon = (status: string) => {
    if (status === "accepted") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    if (status === "declined") return <XCircle className="h-4 w-4 text-red-400" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            {lang === "ar" ? "الدعوات الواردة" : "Job Invitations"}
          </span>
          {pending.length > 0 && (
            <Badge className="bg-primary/10 text-primary border-0 text-[10px]">
              {pending.length} {lang === "ar" ? "جديدة" : "new"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Pending invitations first */}
        {pending.map((inv) => (
          <div
            key={inv.id}
            className="rounded-xl border border-primary/15 bg-primary/5 p-3.5 space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Briefcase className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight">{inv.jobTitle}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {inv.employerName} · {typeLabel(inv.jobType)}
                </p>
                {inv.message && (
                  <p className="text-xs text-muted-foreground mt-1.5 italic border-s-2 border-primary/30 ps-2">
                    "{inv.message}"
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground/70 mt-1.5">
                  {formatDistanceToNow(new Date(inv.createdAt), { addSuffix: true, locale })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="flex-1 h-8 text-xs gap-1"
                onClick={() => respondMutation.mutate({ id: inv.id, status: "accepted" })}
                disabled={respondMutation.isPending}
              >
                {respondMutation.isPending && respondMutation.variables?.id === inv.id && respondMutation.variables?.status === "accepted"
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <CheckCircle2 className="h-3 w-3" />}
                {lang === "ar" ? "قبول" : "Accept"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs gap-1"
                onClick={() => respondMutation.mutate({ id: inv.id, status: "declined" })}
                disabled={respondMutation.isPending}
              >
                {respondMutation.isPending && respondMutation.variables?.id === inv.id && respondMutation.variables?.status === "declined"
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <XCircle className="h-3 w-3" />}
                {lang === "ar" ? "رفض" : "Decline"}
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                <Link href={`/jobs/${inv.jobId}`}>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        ))}

        {/* Responded invitations */}
        {responded.length > 0 && (
          <div className="space-y-1.5">
            {responded.slice(0, 3).map((inv) => (
              <div key={inv.id} className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-accent/50">
                {statusIcon(inv.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{inv.jobTitle}</p>
                  <p className="text-[10px] text-muted-foreground">{inv.employerName}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" asChild>
                  <Link href={`/jobs/${inv.jobId}`}>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
