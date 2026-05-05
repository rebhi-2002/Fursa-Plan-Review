import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useT, useLanguageStore } from "@/lib/i18n";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { useAuth } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Bell, Plus, Trash2, BellRing } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ALL_CATEGORIES = [
  "تقنية المعلومات",
  "التصميم والإبداع",
  "التسويق والمبيعات",
  "التعليم والتدريب",
  "الترجمة واللغات",
  "الإدارة والمحاسبة",
  "الصحة والطب",
  "الهندسة",
  "الإعلام والصحافة",
  "أخرى",
];
const ALL_TYPES: { value: string; labelAr: string; labelEn: string }[] = [
  { value: "online", labelAr: "عن بُعد", labelEn: "Remote" },
  { value: "field", labelAr: "ميداني", labelEn: "Field" },
  { value: "hybrid", labelAr: "هجين", labelEn: "Hybrid" },
];

interface JobAlert {
  id: number;
  categories: string[];
  types: string[];
  isActive: boolean;
  createdAt: string;
}

function apiUrl(path: string) {
  const base = (import.meta.env.BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  return `${base}/api/${path}`;
}

async function authFetch(getToken: () => Promise<string | null>, url: string, options: RequestInit = {}) {
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...((options.headers ?? {}) as Record<string, string>) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(url, { ...options, headers });
}

export default function JobAlertsPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const qc = useQueryClient();
  const { getToken } = useAuth();
  const { data: user } = useGetCurrentUser();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selCategories, setSelCategories] = useState<string[]>([]);
  const [selTypes, setSelTypes] = useState<string[]>([]);

  const { data: alerts = [], isLoading } = useQuery<JobAlert[]>({
    queryKey: ["me-alerts"],
    queryFn: async () => {
      const res = await authFetch(getToken, apiUrl("me/alerts"));
      if (!res.ok) throw new Error("Failed to load alerts");
      return res.json();
    },
    enabled: !!user,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["me-alerts"] });

  const createMut = useMutation({
    mutationFn: async (data: { categories: string[]; types: string[] }) => {
      const res = await authFetch(getToken, apiUrl("me/alerts"), { method: "POST", body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || "Failed"); }
      return res.json();
    },
    onSuccess: () => {
      toast.success(t("alerts.created"));
      invalidate();
      setIsCreateOpen(false);
      setSelCategories([]);
      setSelTypes([]);
    },
    onError: (e: any) => toast.error(e.message || t("common.error")),
  });

  const toggleMut = useMutation({
    mutationFn: async ({ id, alert }: { id: number; alert: JobAlert }) => {
      const res = await authFetch(getToken, apiUrl(`me/alerts/${id}`), {
        method: "PATCH",
        body: JSON.stringify({ categories: alert.categories, types: alert.types, isActive: !alert.isActive }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => invalidate(),
    onError: () => toast.error(t("common.error")),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: number) => {
      await authFetch(getToken, apiUrl(`me/alerts/${id}`), { method: "DELETE" });
    },
    onSuccess: () => { toast.success(t("alerts.deleted")); invalidate(); },
    onError: () => toast.error(t("common.error")),
  });

  const toggleCategory = (c: string) =>
    setSelCategories((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  const toggleType = (v: string) =>
    setSelTypes((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);

  if (!user) return null;

  return (
    <div className="container py-8 max-w-3xl px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BellRing className="h-7 w-7 text-primary" />
            {t("alerts.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("alerts.subtitle")}</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={alerts.length >= 5}>
              <Plus className="h-4 w-4" />
              {t("alerts.new")}
            </Button>
          </DialogTrigger>
          <DialogContent dir={lang === "ar" ? "rtl" : "ltr"}>
            <DialogHeader>
              <DialogTitle>{t("alerts.newTitle")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-2">
              <div>
                <p className="font-medium mb-3">{t("alerts.categories")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_CATEGORIES.map((c) => (
                    <div key={c} className="flex items-center gap-2">
                      <Checkbox id={`cat-${c}`} checked={selCategories.includes(c)} onCheckedChange={() => toggleCategory(c)} />
                      <Label htmlFor={`cat-${c}`} className="text-sm cursor-pointer">{c}</Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t("alerts.allIfEmpty")}</p>
              </div>
              <div>
                <p className="font-medium mb-3">{t("alerts.types")}</p>
                <div className="flex gap-4 flex-wrap">
                  {ALL_TYPES.map((tp) => (
                    <div key={tp.value} className="flex items-center gap-2">
                      <Checkbox id={`type-${tp.value}`} checked={selTypes.includes(tp.value)} onCheckedChange={() => toggleType(tp.value)} />
                      <Label htmlFor={`type-${tp.value}`} className="cursor-pointer">{lang === "ar" ? tp.labelAr : tp.labelEn}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={() => createMut.mutate({ categories: selCategories, types: selTypes })} disabled={createMut.isPending}>
                {createMut.isPending ? t("common.submitting") : t("alerts.save")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
      ) : alerts.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="py-16 text-center">
            <Bell className="h-14 w-14 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">{t("alerts.empty")}</h3>
            <p className="text-muted-foreground text-sm">{t("alerts.emptyDesc")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className={alert.isActive ? "" : "opacity-60"}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {alert.categories.length === 0
                        ? <Badge variant="secondary">{t("alerts.allCategories")}</Badge>
                        : alert.categories.map((c) => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)
                      }
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {alert.types.length === 0
                        ? <Badge variant="outline">{t("alerts.allTypes")}</Badge>
                        : alert.types.map((tp) => {
                            const lbl = ALL_TYPES.find((x) => x.value === tp);
                            return <Badge key={tp} variant="outline" className="text-xs">{lang === "ar" ? lbl?.labelAr : lbl?.labelEn}</Badge>;
                          })
                      }
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Switch
                      checked={alert.isActive}
                      onCheckedChange={() => toggleMut.mutate({ id: alert.id, alert })}
                      disabled={toggleMut.isPending}
                    />
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => deleteMut.mutate(alert.id)} disabled={deleteMut.isPending}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <p className="text-xs text-muted-foreground text-center pt-1">{alerts.length}/5 {t("alerts.limit")}</p>
        </div>
      )}
    </div>
  );
}
