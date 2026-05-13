import { useState, useRef, useEffect } from "react";
import { useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UserPlus,
  Search,
  Loader2,
  CheckCircle2,
  MapPin,
  X,
  Send,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Seeker {
  id: string;
  name: string;
  email: string;
  location?: string | null;
}

interface Invitation {
  id: number;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  seeker: { id: string; name: string; email: string; location?: string | null };
}

interface Props {
  jobId: number;
  jobTitle: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function InviteCandidateDialog({ jobId, jobTitle, open, onOpenChange }: Props) {
  const { lang } = useLanguageStore();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [selected, setSelected] = useState<Seeker | null>(null);
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebouncedQ(query), 350);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query]);

  const { data: seekers = [], isFetching } = useQuery<Seeker[]>({
    queryKey: ["seeker-search", debouncedQ],
    queryFn: async () => {
      if (debouncedQ.length < 2) return [];
      const res = await fetch(`/api/employer/seekers/search?q=${encodeURIComponent(debouncedQ)}`, {
        credentials: "include",
      });
      return res.ok ? res.json() : [];
    },
    enabled: debouncedQ.length >= 2,
  });

  const { data: invitations = [], isLoading: loadingInvitations } = useQuery<Invitation[]>({
    queryKey: ["job-invitations", jobId],
    queryFn: async () => {
      const res = await fetch(`/api/employer/jobs/${jobId}/invitations`, { credentials: "include" });
      return res.ok ? res.json() : [];
    },
    enabled: open,
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!selected) throw new Error("no seeker");
      const res = await fetch(`/api/employer/jobs/${jobId}/invite`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seekerId: selected.id, message: message || undefined }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "failed");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success(lang === "ar" ? "تم إرسال الدعوة بنجاح!" : "Invitation sent successfully!");
      setSelected(null);
      setQuery("");
      setMessage("");
      qc.invalidateQueries({ queryKey: ["job-invitations", jobId] });
    },
    onError: (e: Error) => {
      if (e.message === "already invited") {
        toast.error(lang === "ar" ? "تمت دعوة هذا المرشح مسبقاً" : "This candidate was already invited");
      } else {
        toast.error(lang === "ar" ? "فشل إرسال الدعوة" : "Failed to send invitation");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/employer/invitations/${id}`, { method: "DELETE", credentials: "include" });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job-invitations", jobId] });
      toast.success(lang === "ar" ? "تم سحب الدعوة" : "Invitation withdrawn");
    },
  });

  const statusBadge = (status: string) => {
    if (status === "accepted") return <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">{lang === "ar" ? "قبل" : "Accepted"}</Badge>;
    if (status === "declined") return <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">{lang === "ar" ? "رفض" : "Declined"}</Badge>;
    return <Badge variant="secondary" className="text-[10px]">{lang === "ar" ? "بانتظار الرد" : "Pending"}</Badge>;
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" dir={dir}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            {lang === "ar" ? "دعوة مرشح" : "Invite Candidate"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {lang === "ar" ? `ابحث عن باحث عن عمل وادعوه للتقديم على: ` : `Search and invite a job seeker to apply to: `}
            <span className="font-medium text-foreground">{jobTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          {!selected ? (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === "ar" ? "ابحث بالاسم أو البريد الإلكتروني..." : "Search by name or email..."}
                  className="ps-9"
                  autoFocus
                />
                {isFetching && <Loader2 className="absolute end-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />}
              </div>

              {seekers.length > 0 && (
                <ScrollArea className="h-44 rounded-md border">
                  <div className="p-1">
                    {seekers.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelected(s)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent text-start transition-colors"
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {s.name?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{s.name}</p>
                          <p className="text-xs text-muted-foreground truncate" dir="ltr">{s.email}</p>
                        </div>
                        {s.location && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                            <MapPin className="h-3 w-3" />{s.location}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {debouncedQ.length >= 2 && !isFetching && seekers.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  {lang === "ar" ? "لا توجد نتائج" : "No results found"}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Selected seeker card */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {selected.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{selected.name}</p>
                  <p className="text-xs text-muted-foreground" dir="ltr">{selected.email}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setSelected(null)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Optional message */}
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={lang === "ar" ? "رسالة شخصية (اختياري)..." : "Personal message (optional)..."}
                rows={3}
                className="resize-none text-sm"
                maxLength={1000}
              />
              <p className="text-[10px] text-muted-foreground text-end">{message.length}/1000</p>
            </div>
          )}

          {/* Existing invitations */}
          {invitations.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Users className="h-3.5 w-3.5" />
                  {lang === "ar" ? "المدعوون" : "Invited Candidates"} ({invitations.length})
                </p>
                <ScrollArea className="h-36">
                  <div className="space-y-1.5 pe-2">
                    {invitations.map((inv) => (
                      <div key={inv.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-accent/50 group">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback className="text-[10px] bg-muted">
                            {inv.seeker.name?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{inv.seeker.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate" dir="ltr">{inv.seeker.email}</p>
                        </div>
                        {statusBadge(inv.status)}
                        {inv.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                            onClick={() => deleteMutation.mutate(inv.id)}
                          >
                            <X className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {lang === "ar" ? "إغلاق" : "Close"}
          </Button>
          {selected && (
            <Button
              onClick={() => inviteMutation.mutate()}
              disabled={inviteMutation.isPending}
              className="gap-2"
            >
              {inviteMutation.isPending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />}
              {lang === "ar" ? "إرسال الدعوة" : "Send Invitation"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
