import { Link, useRoute } from "wouter";
import { useGetPublicSeekerProfile } from "@workspace/api-client-react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  User,
  MapPin,
  Phone,
  FileText,
} from "lucide-react";

export default function PublicSeekerProfile() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [, params] = useRoute("/seekers/:id");
  const id = params?.id ?? "";

  const { data: seeker, isLoading, error } = useGetPublicSeekerProfile(id, {
    query: { enabled: !!id, queryKey: ["seeker-profile", id] as any },
  });

  if (isLoading) {
    return (
      <div className="container py-8 max-w-2xl space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !seeker) {
    return (
      <div className="container py-20 text-center">
        <User className="h-16 w-16 text-muted-foreground opacity-20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("seekers.profile.notFound")}</h2>
        <p className="text-muted-foreground mb-6">{t("seekers.profile.notFoundDesc")}</p>
        <Button asChild variant="outline">
          <Link href="/jobs">{t("jobs.backToJobs")}</Link>
        </Button>
      </div>
    );
  }

  const sk = seeker as any;

  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/jobs">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{t("seekers.profile.title")}</h1>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{sk.name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                {sk.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {sk.location}
                  </span>
                )}
                {sk.phone && (
                  <span className="flex items-center gap-1" dir="ltr">
                    <Phone className="h-3.5 w-3.5" />
                    {sk.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {sk.bio && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {lang === "ar" ? "نبذة" : "About"}
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{sk.bio}</p>
            </div>
          )}

          {sk.cvObjectPath && (
            <div className="border-t pt-4 flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-medium">
                {lang === "ar" ? "السيرة الذاتية متاحة" : "CV available"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
