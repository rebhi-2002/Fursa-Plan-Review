import { useQuery } from "@tanstack/react-query";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Sparkles, UserSearch } from "lucide-react";
import { Link } from "wouter";

type SuggestedCandidate = {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
};

const AVATAR_COLORS = [
  ["#3730a3", "#eef2ff"],
  ["#0f766e", "#f0fdfa"],
  ["#be123c", "#fff1f2"],
  ["#15803d", "#f0fdf4"],
  ["#1d4ed8", "#eff6ff"],
  ["#92400e", "#fffbeb"],
  ["#6d28d9", "#f5f3ff"],
  ["#0e7490", "#ecfeff"],
] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function SuggestedCandidates({ jobId }: { jobId: number }) {
  const t = useT();
  const { lang } = useLanguageStore();

  const { data, isLoading } = useQuery<SuggestedCandidate[]>({
    queryKey: ["suggested-candidates", jobId],
    queryFn: async () => {
      const res = await fetch(`/api/employer/jobs/${jobId}/suggested-candidates`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<SuggestedCandidate[]>;
    },
    enabled: !!jobId,
  });

  return (
    <Card className="mt-8">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">{t("employer.suggested.title")}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t("employer.suggested.subtitle")}
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((candidate, idx) => {
              const colors = AVATAR_COLORS[idx % AVATAR_COLORS.length]!;
              return (
                <div
                  key={candidate.id}
                  className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ background: colors[0], color: colors[1] }}
                    >
                      {getInitials(candidate.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{candidate.name}</p>
                      {candidate.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{candidate.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {candidate.bio && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {candidate.bio}
                    </p>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full mt-auto text-xs"
                  >
                    <Link
                      href={`/seekers/${candidate.id}`}
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    >
                      {t("employer.suggested.viewProfile")}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center">
            <UserSearch className="h-12 w-12 text-muted-foreground opacity-25 mb-3" />
            <p className="font-semibold text-muted-foreground">
              {t("employer.suggested.empty")}
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs">
              {t("employer.suggested.emptyDesc")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
