import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  useListJobs,
  useListJobCategories,
  ListJobsType,
} from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Clock, Briefcase, Building2, Search, ArrowUpDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";

const ALL = "all";
type SortOption = "newest" | "oldest" | "deadline";

export default function JobsPage() {
  const t = useT();
  const { lang } = useLanguageStore();

  const searchParams = new URLSearchParams(window.location.search);
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || ALL;

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<string>(initialCategory);
  const [type, setType] = useState<ListJobsType | typeof ALL>(ALL);
  const [sort, setSort] = useState<SortOption>("newest");

  const { data: categories } = useListJobCategories();

  const { data: jobsResponse, isLoading } = useListJobs({
    search: search || undefined,
    category: category === ALL ? undefined : category,
    type: type === ALL ? undefined : (type as ListJobsType),
    limit: 100,
  });

  const locale = lang === "ar" ? ar : enUS;

  const sortedJobs = useMemo(() => {
    if (!jobsResponse?.items) return [];
    const items = [...jobsResponse.items];
    if (sort === "oldest") return items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    if (sort === "deadline") {
      return items.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    }
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [jobsResponse?.items, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory(ALL);
    setType(ALL);
    setSort("newest");
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {t("jobs.title")}
          </h1>
          <p className="text-muted-foreground">{t("jobs.subtitle")}</p>
        </div>

        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute top-3 h-4 w-4 text-muted-foreground rtl:right-3 ltr:left-3" />
              <Input
                placeholder={t("jobs.search")}
                className="rtl:pr-9 ltr:pl-9 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:w-auto flex-wrap">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-[200px] bg-background">
                  <SelectValue placeholder={t("jobs.category.all")} />
                </SelectTrigger>
                <SelectContent dir={lang === "ar" ? "rtl" : "ltr"}>
                  <SelectItem value={ALL}>{t("jobs.category.all")}</SelectItem>
                  {Array.isArray(categories) && categories.map((cat) => (
                    <SelectItem key={cat.category} value={cat.category}>
                      {cat.category} ({cat.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={type}
                onValueChange={(val) =>
                  setType(val as ListJobsType | typeof ALL)
                }
              >
                <SelectTrigger className="w-full sm:w-[150px] bg-background">
                  <SelectValue placeholder={t("jobs.type.all")} />
                </SelectTrigger>
                <SelectContent dir={lang === "ar" ? "rtl" : "ltr"}>
                  <SelectItem value={ALL}>{t("jobs.type.all")}</SelectItem>
                  <SelectItem value="online">{t("jobs.type.online")}</SelectItem>
                  <SelectItem value="field">{t("jobs.type.field")}</SelectItem>
                  <SelectItem value="hybrid">{t("jobs.type.hybrid")}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                <SelectTrigger className="w-full sm:w-[160px] bg-background gap-1.5">
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder={t("jobs.sort.newest")} />
                </SelectTrigger>
                <SelectContent dir={lang === "ar" ? "rtl" : "ltr"}>
                  <SelectItem value="newest">{t("jobs.sort.newest")}</SelectItem>
                  <SelectItem value="oldest">{t("jobs.sort.oldest")}</SelectItem>
                  <SelectItem value="deadline">{t("jobs.sort.deadline")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">
            {isLoading
              ? t("jobs.searching")
              : t("jobs.found", { count: sortedJobs.length })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[280px] w-full rounded-2xl" />
              ))
            ) : sortedJobs.length > 0 ? (
              sortedJobs.map((job) => (
                <Card
                  key={job.id}
                  className="flex flex-col h-full hover:shadow-md transition-shadow border-border/50"
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
                          <span className="truncate">
                            {job.employerLocation}
                          </span>
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
              <div className="col-span-full py-16 text-center bg-muted/20 rounded-2xl border border-dashed">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium">{t("jobs.notFound")}</h3>
                <p className="text-muted-foreground mt-1">
                  {t("jobs.tryDifferent")}
                </p>
                <Button variant="link" onClick={clearFilters} className="mt-4">
                  {t("jobs.clearFilters")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
