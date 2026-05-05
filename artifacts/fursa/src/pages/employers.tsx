import { useState } from "react";
import { Link, useRoute } from "wouter";
import {
  useGetPublicEmployerProfile,
  getGetPublicEmployerProfileQueryKey,
  useGetCurrentUser,
} from "@workspace/api-client-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ChevronLeft,
  Building2,
  Globe,
  MapPin,
  Phone,
  Briefcase,
  AlertCircle,
  Star,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  seekerName: string;
}
interface ReviewsData {
  reviews: Review[];
  avgRating: number | null;
  totalReviews: number;
}

function apiUrl(path: string) {
  const base = (import.meta.env.BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  return `${base}/api/${path}`;
}

async function authFetch(getToken: () => Promise<string | null>, url: string, opts: RequestInit = {}) {
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...((opts.headers ?? {}) as Record<string, string>) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(url, { ...opts, headers });
}

function StarRating({ value, max = 5, size = "sm" }: { value: number; max?: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} className={`${sz} ${i < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => onChange(i)} className="cursor-pointer">
          <Star className={`h-7 w-7 transition-colors ${i <= (hover || value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
        </button>
      ))}
    </div>
  );
}

export default function PublicEmployerProfile() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [, params] = useRoute("/employers/:id");
  const id = params?.id ?? "";
  const { getToken } = useAuth();
  const qc = useQueryClient();
  const { data: currentUser } = useGetCurrentUser();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  const {
    data: profile,
    isLoading,
    isError,
  } = useGetPublicEmployerProfile(id, {
    query: { queryKey: getGetPublicEmployerProfileQueryKey(id), enabled: !!id },
  });

  const { data: reviewsData } = useQuery<ReviewsData>({
    queryKey: ["employer-reviews", id],
    queryFn: async () => {
      const res = await fetch(apiUrl(`employers/${id}/reviews`));
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!id,
  });

  const submitReviewMut = useMutation({
    mutationFn: async () => {
      const res = await authFetch(getToken, apiUrl("reviews"), {
        method: "POST",
        body: JSON.stringify({ employerId: id, rating: reviewRating, comment: reviewComment.trim() || null }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || "Failed"); }
      return res.json();
    },
    onSuccess: () => {
      toast.success(t("reviews.submitted"));
      qc.invalidateQueries({ queryKey: ["employer-reviews", id] });
      setReviewOpen(false);
      setReviewComment("");
      setReviewRating(5);
    },
    onError: (e: any) => toast.error(e.message || t("common.error")),
  });

  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="container py-20 max-w-2xl text-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          {t("employer.publicProfile.notFound")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("employer.publicProfile.notFoundDesc")}
        </p>
        <Button asChild>
          <Link href="/jobs">{t("nav.jobs")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/jobs">
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            {t("employer.publicProfile.backToJobs")}
          </Link>
        </Button>
      </div>

      {/* Profile header */}
      <Card className="overflow-hidden mb-6">
        <div className="h-28 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
        <CardContent className="px-6 pb-6 -mt-10">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="h-20 w-20 rounded-xl border-4 border-background bg-primary/10 flex items-center justify-center shrink-0 shadow-sm">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1 min-w-0 pt-10">
              <h1 className="text-2xl font-bold tracking-tight">
                {profile.name}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                {profile.location && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {t("employer.publicProfile.visitWebsite")}
                  </a>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>
            <Badge variant="secondary" className="mt-10 gap-1.5 shrink-0">
              <Briefcase className="h-3.5 w-3.5" />
              {profile.jobs.length} {t("employer.publicProfile.openJobs")}
            </Badge>
          </div>
          {profile.bio && (
            <p className="mt-4 text-muted-foreground leading-relaxed text-sm border-t pt-4">
              {profile.bio}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            {t("reviews.title")}
            {reviewsData && reviewsData.totalReviews > 0 && (
              <Badge variant="secondary" className="font-normal">
                {reviewsData.avgRating?.toFixed(1)} · {reviewsData.totalReviews}
              </Badge>
            )}
          </h2>
          {currentUser?.role === "seeker" && (
            <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {t("reviews.write")}
                </Button>
              </DialogTrigger>
              <DialogContent dir={lang === "ar" ? "rtl" : "ltr"}>
                <DialogHeader>
                  <DialogTitle>{t("reviews.writeTitle")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 py-2">
                  <div>
                    <p className="font-medium mb-2">{t("reviews.rating")}</p>
                    <StarPicker value={reviewRating} onChange={setReviewRating} />
                  </div>
                  <div>
                    <p className="font-medium mb-2">{t("reviews.comment")}</p>
                    <Textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="min-h-[100px]" placeholder={t("reviews.commentPlaceholder")} />
                  </div>
                  <Button className="w-full" onClick={() => submitReviewMut.mutate()} disabled={submitReviewMut.isPending}>
                    {submitReviewMut.isPending ? t("common.submitting") : t("reviews.submit")}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">{t("reviews.eligibility")}</p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {!reviewsData || reviewsData.reviews.length === 0 ? (
          <Card className="border-dashed bg-muted/20 mb-6">
            <CardContent className="p-6 text-center">
              <Star className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">{t("reviews.empty")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 mb-6">
            {reviewsData.reviews.slice(0, 5).map((r) => (
              <Card key={r.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm">{r.seekerName}</p>
                      <StarRating value={r.rating} />
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(r.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                    </span>
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.comment}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Active Jobs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {t("employer.publicProfile.openJobsTitle")}
        </h2>
        {profile.jobs.length > 0 ? (
          <div className="space-y-3">
            {profile.jobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-sm transition-shadow"
              >
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{job.title}</h3>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {job.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {t(`jobs.type.${job.type}`)}
                      </Badge>
                    </div>
                  </div>
                  <Button asChild size="sm" className="shrink-0">
                    <Link href={`/jobs/${job.id}`}>
                      {t("employer.publicProfile.viewJob")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-10 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {t("employer.publicProfile.noJobs")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
