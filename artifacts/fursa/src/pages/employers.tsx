import { Link, useRoute } from "wouter";
import {
  useGetPublicEmployerProfile,
} from "@workspace/api-client-react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  Building2,
  Globe,
  MapPin,
  Phone,
  Briefcase,
  AlertCircle,
} from "lucide-react";

export default function PublicEmployerProfile() {
  const t = useT();
  const { lang: _lang } = useLanguageStore();
  const [, params] = useRoute("/employers/:id");
  const id = params?.id ?? "";

  const {
    data: profile,
    isLoading,
    isError,
  } = useGetPublicEmployerProfile(id, {
    query: { enabled: !!id },
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
