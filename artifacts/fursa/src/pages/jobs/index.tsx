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
import { MapPin, Clock, Briefcase, Building2, Search, ArrowUpDown, Filter, X, Bell, Tag, DollarSign } from "lucide-react";
import { formatDistanceToNow, subDays } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

function apiUrl(path: string) {
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
  return `${base}/api/${path}`;
}

const ALL = "all";
type SortOption = "newest" | "oldest" | "deadline";
type DateFilter = "all" | "today" | "week" | "month";

export default function JobsPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const { getToken, isSignedIn } = useAuth();

  const searchParams = new URLSearchParams(window.location.search);
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || ALL;

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<string>(initialCategory);
  const [type, setType] = useState<ListJobsType | typeof ALL>(ALL);
  const [sort, setSort] = useState<SortOption>("newest");
  const [location, setLocation] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [tagFilter, setTagFilter] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const saveSearchMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const categories = category !== ALL ? [category] : [];
      const types = type !== ALL ? [type] : [];
      const res = await fetch(apiUrl("me/alerts"), {
        method: "POST",
        headers,
        body: JSON.stringify({ categories, types }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error((e as any).error || "Failed");
      }
      return res.json();
    },
    onSuccess: () => toast.success(lang === "ar" ? "تم حفظ البحث — ستتلقى تنبيهات بالوظائف الجديدة" : "Search saved — you'll get alerts for new matching jobs"),
    onError: () => toast.error(lang === "ar" ? "تعذر حفظ البحث" : "Could not save search"),
  });

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
    let items = [...jobsResponse.items];

    // Location filter
    if (location.trim()) {
      const q = location.toLowerCase();
      items = items.filter((j) =>
        (j.employerLocation ?? "").toLowerCase().includes(q)
      );
    }

    // Date posted filter
    if (dateFilter !== "all") {
      const now = new Date();
      const cutoff =
        dateFilter === "today"
          ? subDays(now, 1)
          : dateFilter === "week"
          ? subDays(now, 7)
          : subDays(now, 30);
      items = items.filter((j) => new Date(j.createdAt) >= cutoff);
    }

    // Tag filter
    if (tagFilter.trim()) {
      const q = tagFilter.toLowerCase();
      items = items.filter((j) =>
        ((j as any).tags ?? "").toLowerCase().includes(q)
      );
    }

    // Salary filter
    if (salaryMin.trim()) {
      const min = parseInt(salaryMin, 10);
      if (!isNaN(min)) {
        items = items.filter((j) => {
          const jMax = (j as any).salaryMax;
          return jMax == null || jMax >= min;
        });
      }
    }
    if (salaryMax.trim()) {
      const max = parseInt(salaryMax, 10);
      if (!isNaN(max)) {
        items = items.filter((j) => {
          const jMin = (j as any).salaryMin;
          return jMin == null || jMin <= max;
        });
      }
    }

    // Sort
    if (sort === "oldest")
      return items.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    if (sort === "deadline") {
      return items.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return (
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
      });
    }
    return items.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [jobsResponse?.items, sort, location, dateFilter, tagFilter, salaryMin, salaryMax]);

  const activeFilterCount = [
    category !== ALL,
    type !== ALL,
    location.trim() !== "",
    dateFilter !== "all",
    tagFilter.trim() !== "",
    salaryMin.trim() !== "",
    salaryMax.trim() !== "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setCategory(ALL);
    setType(ALL);
    setSort("newest");
    setLocation("");
    setDateFilter("all");
    setTagFilter("");
    setSalaryMin("");
    setSalaryMax("");
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
          <CardContent className="p-4 flex flex-col gap-3">
            {/* Main search row */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute top-3 h-4 w-4 text-muted-foreground rtl:right-3 ltr:left-3" />
                <Input
                  placeholder={t("jobs.search")}
                  className="rtl:pr-9 ltr:pl-9 bg-background"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-background">
                    <SelectValue placeholder={t("jobs.category.all")} />
                  </SelectTrigger>
                  <SelectContent dir={lang === "ar" ? "rtl" : "ltr"}>
                    <SelectItem value={ALL}>{t("jobs.category.all")}</SelectItem>
                    {Array.isArray(categories) &&
                      categories.map((cat) => (
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
                  <SelectTrigger className="w-full sm:w-[130px] bg-background">
                    <SelectValue placeholder={t("jobs.type.all")} />
                  </SelectTrigger>
                  <SelectContent dir={lang === "ar" ? "rtl" : "ltr"}>
                    <SelectItem value={ALL}>{t("jobs.type.all")}</SelectItem>
                    <SelectItem value="online">{t("jobs.type.online")}</SelectItem>
                    <SelectItem value="field">{t("jobs.type.field")}</SelectItem>
                    <SelectItem value="hybrid">{t("jobs.type.hybrid")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sort}
                  onValueChange={(v) => setSort(v as SortOption)}
                >
                  <SelectTrigger className="w-full sm:w-[150px] bg-background gap-1.5">
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder={t("jobs.sort.newest")} />
                  </SelectTrigger>
                  <SelectContent dir={lang === "ar" ? "rtl" : "ltr"}>
                    <SelectItem value="newest">{t("jobs.sort.newest")}</SelectItem>
                    <SelectItem value="oldest">{t("jobs.sort.oldest")}</SelectItem>
                    <SelectItem value="deadline">{t("jobs.sort.deadline")}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Advanced filters toggle */}
                <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-background gap-1.5 relative">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {lang === "ar" ? "فلاتر متقدمة" : "Advanced"}
                      </span>
                      {activeFilterCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">
                        {lang === "ar" ? "فلاتر متقدمة" : "Advanced Filters"}
                      </h4>

                      {/* Location filter */}
                      <div>
                        <Label className="text-xs mb-1.5 block">
                          {lang === "ar" ? "الموقع الجغرافي" : "Location"}
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute top-2.5 h-4 w-4 text-muted-foreground ltr:left-2.5 rtl:right-2.5" />
                          <Input
                            placeholder={lang === "ar" ? "ابحث بالموقع..." : "Search by location..."}
                            className="ltr:pl-8 rtl:pr-8 h-9 text-sm"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          />
                          {location && (
                            <button
                              onClick={() => setLocation("")}
                              className="absolute top-2.5 ltr:right-2.5 rtl:left-2.5 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Date posted filter */}
                      <div>
                        <Label className="text-xs mb-1.5 block">
                          {lang === "ar" ? "تاريخ النشر" : "Date Posted"}
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {(
                            [
                              { value: "all", ar: "الكل", en: "Any Time" },
                              { value: "today", ar: "اليوم", en: "Last 24h" },
                              { value: "week", ar: "هذا الأسبوع", en: "Past Week" },
                              { value: "month", ar: "هذا الشهر", en: "Past Month" },
                            ] as { value: DateFilter; ar: string; en: string }[]
                          ).map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setDateFilter(opt.value)}
                              className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${
                                dateFilter === opt.value
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border hover:bg-accent"
                              }`}
                            >
                              {lang === "ar" ? opt.ar : opt.en}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tag filter */}
                      <div>
                        <Label className="text-xs mb-1.5 block">
                          {lang === "ar" ? "الوسوم / المهارات" : "Tags / Skills"}
                        </Label>
                        <div className="relative">
                          <Tag className="absolute top-2.5 h-4 w-4 text-muted-foreground ltr:left-2.5 rtl:right-2.5" />
                          <Input
                            placeholder={lang === "ar" ? "مثال: React، تصميم..." : "e.g. React, Design..."}
                            className="ltr:pl-8 rtl:pr-8 h-9 text-sm"
                            value={tagFilter}
                            onChange={(e) => setTagFilter(e.target.value)}
                          />
                          {tagFilter && (
                            <button
                              onClick={() => setTagFilter("")}
                              className="absolute top-2.5 ltr:right-2.5 rtl:left-2.5 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Salary filter */}
                      <div>
                        <Label className="text-xs mb-1.5 block flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          {lang === "ar" ? "نطاق الراتب" : "Salary Range"}
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              placeholder={lang === "ar" ? "الحد الأدنى" : "Min"}
                              className="h-9 text-sm"
                              value={salaryMin}
                              onChange={(e) => setSalaryMin(e.target.value)}
                            />
                          </div>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              placeholder={lang === "ar" ? "الحد الأقصى" : "Max"}
                              className="h-9 text-sm"
                              value={salaryMax}
                              onChange={(e) => setSalaryMax(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {isSignedIn && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1.5"
                            disabled={saveSearchMutation.isPending || (category === ALL && type === ALL)}
                            onClick={() => { saveSearchMutation.mutate(); setShowAdvanced(false); }}
                          >
                            <Bell className="h-3.5 w-3.5" />
                            {lang === "ar" ? "حفظ البحث" : "Save Search"}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setLocation("");
                            setDateFilter("all");
                            setTagFilter("");
                            setShowAdvanced(false);
                          }}
                        >
                          {lang === "ar" ? "مسح الفلاتر" : "Clear Filters"}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Active filter badges */}
            {(location || dateFilter !== "all" || tagFilter) && (
              <div className="flex flex-wrap gap-2">
                {location && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    <MapPin className="h-3 w-3" />
                    {location}
                    <button onClick={() => setLocation("")} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {dateFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    <Clock className="h-3 w-3" />
                    {lang === "ar"
                      ? dateFilter === "today" ? "اليوم" : dateFilter === "week" ? "هذا الأسبوع" : "هذا الشهر"
                      : dateFilter === "today" ? "Last 24h" : dateFilter === "week" ? "Past Week" : "Past Month"}
                    <button onClick={() => setDateFilter("all")} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {tagFilter && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    <Tag className="h-3 w-3" />
                    {tagFilter}
                    <button onClick={() => setTagFilter("")} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isLoading
                ? t("jobs.searching")
                : t("jobs.found", { count: sortedJobs.length })}
            </div>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground gap-1">
                <X className="h-3 w-3" />
                {lang === "ar" ? "مسح الكل" : "Clear All"}
              </Button>
            )}
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
                      {(job as any).salaryMin || (job as any).salaryMax ? (
                        <div className="flex items-center text-sm text-green-700 dark:text-green-400 font-medium">
                          <DollarSign className="h-3.5 w-3.5 mr-1 ms-1 opacity-70" />
                          {(job as any).salaryMin && (job as any).salaryMax
                            ? `${(job as any).salaryMin.toLocaleString()}–${(job as any).salaryMax.toLocaleString()} ${(job as any).salaryCurrency || "USD"}`
                            : (job as any).salaryMin
                            ? `${(job as any).salaryMin.toLocaleString()}+ ${(job as any).salaryCurrency || "USD"}`
                            : `${lang === "ar" ? "حتى" : "Up to"} ${(job as any).salaryMax!.toLocaleString()} ${(job as any).salaryCurrency || "USD"}`}
                        </div>
                      ) : null}
                      {(job as any).tags && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {((job as any).tags as string)
                            .split(/[,،]/)
                            .map((tag: string) => tag.trim())
                            .filter(Boolean)
                            .slice(0, 4)
                            .map((tag: string) => (
                              <button
                                key={tag}
                                onClick={(e) => { e.preventDefault(); setTagFilter(tag); }}
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] rounded bg-muted hover:bg-primary/10 hover:text-primary border border-border/50 transition-colors"
                              >
                                <Tag className="h-2.5 w-2.5 opacity-60" />
                                {tag}
                              </button>
                            ))}
                        </div>
                      )}
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
