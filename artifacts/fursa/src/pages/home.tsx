import { Link, useLocation } from "wouter";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  useListFeaturedJobs,
  useListJobCategories,
} from "@workspace/api-client-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase, Building2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [, setLocation] = useLocation();

  const { data: featuredJobs, isLoading: isLoadingJobs } =
    useListFeaturedJobs();
  const { data: categories, isLoading: isLoadingCats } = useListJobCategories();

  const locale = lang === "ar" ? ar : enUS;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q")?.toString().trim();
    if (query) {
      setLocation(`/jobs?search=${encodeURIComponent(query)}`);
    } else {
      setLocation(`/jobs`);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-20 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-sm rounded-full bg-primary/10 text-primary border-0"
          >
            {t("home.badge")}
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mb-6">
            {t("home.heroTitle1")}{" "}
            <span className="text-primary">{t("app.name")}</span>{" "}
            {t("home.heroTitle2")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            {t("home.heroSubtitle")}
          </p>

          <div className="w-full max-w-2xl bg-background rounded-2xl shadow-lg border p-2">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1 flex items-center">
                <Briefcase className="absolute text-muted-foreground h-5 w-5 rtl:right-4 ltr:left-4" />
                <input
                  name="q"
                  type="text"
                  placeholder={t("home.searchPlaceholder")}
                  className="w-full h-14 bg-transparent border-0 focus:ring-0 rtl:pr-12 rtl:pl-4 ltr:pl-12 ltr:pr-4 text-lg outline-none"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 text-lg rounded-xl"
              >
                {t("home.searchButton")}
              </Button>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span>{t("home.popular")}</span>
            {isLoadingCats
              ? null
              : categories?.slice(0, 3).map((cat) => (
                  <Link
                    key={cat.category}
                    href={`/jobs?category=${encodeURIComponent(cat.category)}`}
                    className="hover:text-primary transition-colors hover:underline"
                  >
                    {cat.category}
                  </Link>
                ))}
          </div>
        </div>

        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/3 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10 gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {t("home.categoriesTitle")}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t("home.categoriesSubtitle")}
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/jobs">{t("home.viewAllCategories")}</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isLoadingCats
              ? Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))
              : categories?.slice(0, 10).map((cat) => (
                  <Link
                    key={cat.category}
                    href={`/jobs?category=${encodeURIComponent(cat.category)}`}
                  >
                    <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                      <CardContent className="p-6 flex flex-col items-center text-center justify-center h-full gap-3">
                        <div className="font-semibold group-hover:text-primary transition-colors">
                          {cat.category}
                        </div>
                        <Badge variant="secondary" className="font-normal">
                          {t("home.jobCount", { count: cat.count })}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/jobs">{t("home.viewAllCategories")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10 gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {t("home.featuredTitle")}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t("home.featuredSubtitle")}
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/jobs">{t("home.viewAllJobs")}</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingJobs ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[280px] w-full rounded-2xl" />
              ))
            ) : featuredJobs && featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="flex flex-col h-full hover:shadow-lg transition-shadow border-border/50"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                      >
                        {job.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        {t(`jobs.type.${job.type}`)}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-1 hover:text-primary transition-colors">
                      <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Building2 className="h-4 w-4 mr-2 ms-2 opacity-70" />
                        <span className="font-medium text-foreground/80">
                          {job.employerName}
                        </span>
                      </div>
                      {job.employerLocation && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4 mr-2 ms-2 opacity-70" />
                          <span>{job.employerLocation}</span>
                        </div>
                      )}
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="h-4 w-4 mr-2 ms-2 opacity-70" />
                        <span>
                          {formatDistanceToNow(new Date(job.createdAt), {
                            addSuffix: true,
                            locale,
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/jobs/${job.id}`}>{t("jobs.details")}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-background rounded-2xl border border-dashed">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  {t("jobs.notFound")}
                </h3>
              </div>
            )}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/jobs">{t("home.viewAllJobs")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t("home.ctaTitle")}
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            {t("home.ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-primary font-bold px-8 h-14 text-lg"
            >
              <Link href="/sign-up">{t("home.ctaSignUp")}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 h-14 text-lg"
            >
              <Link href="/jobs">{t("home.ctaBrowse")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
