import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { useLanguageStore } from "@/lib/i18n";
import { useGetCurrentUser } from "@workspace/api-client-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart2,
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Eye,
  MousePointerClick,
  ArrowUp,
  ArrowDown,
  Minus,
  DollarSign,
  Clock,
} from "lucide-react";

function apiUrl(path: string) {
  const base = (import.meta.env.BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  return `${base}/api/${path}`;
}

async function authFetch(getToken: () => Promise<string | null>, url: string) {
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(url, { headers, credentials: "include" });
}

interface JobStat {
  id: number;
  title: string;
  applicationsCount: number;
  unseenApplicationsCount: number;
  viewsCount: number;
  conversionRate: number;
  status: string;
  isOpen: boolean;
  category: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  deadline: string | null;
  createdAt: string;
}

interface ApplicationTrend {
  week: string;
  count: number;
}

interface SalaryBenchmark {
  category: string;
  platformAvgMin: number;
  platformAvgMax: number;
  platformJobCount: number;
  yourMin: number | null;
  yourMax: number | null;
  currency: string;
}

interface EmployerAnalytics {
  totalJobs: number;
  totalApplications: number;
  totalViews: number;
  unseenApplications: number;
  jobs: JobStat[];
  applicationTrends: ApplicationTrend[];
  salaryBenchmarks: SalaryBenchmark[];
}

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function formatWeek(week: string, lang: string) {
  const d = new Date(week);
  if (isNaN(d.getTime())) return week;
  return d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { month: "short", day: "numeric" });
}

function SalaryCompareIcon({ yourMid, platformMid }: { yourMid: number | null; platformMid: number }) {
  if (yourMid == null) return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  if (yourMid > platformMid) return <ArrowUp className="h-3.5 w-3.5 text-emerald-500" />;
  if (yourMid < platformMid) return <ArrowDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-amber-500" />;
}

export default function EmployerAnalyticsPage() {
  const { lang } = useLanguageStore();
  const { getToken } = useAuth();
  const { data: dbUser } = useGetCurrentUser();

  const { data, isLoading } = useQuery<EmployerAnalytics>({
    queryKey: ["employer-analytics-v2"],
    queryFn: async () => {
      const res = await authFetch(getToken, apiUrl("employer/analytics"));
      if (!res.ok) throw new Error("Failed to load analytics");
      return res.json();
    },
    enabled: dbUser?.role === "employer",
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="container py-8 max-w-6xl space-y-6">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-80 rounded-xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const jobs = data?.jobs ?? [];
  const trends = data?.applicationTrends ?? [];
  const benchmarks = data?.salaryBenchmarks ?? [];

  const totalConversionRate = data && data.totalViews > 0
    ? Math.round((data.totalApplications / data.totalViews) * 100)
    : 0;

  const statCards = [
    {
      title: lang === "ar" ? "إجمالي الوظائف" : "Total Jobs",
      value: data?.totalJobs ?? 0,
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-950/20",
      border: "border-indigo-200 dark:border-indigo-800",
    },
    {
      title: lang === "ar" ? "إجمالي الطلبات" : "Total Applications",
      value: data?.totalApplications ?? 0,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    {
      title: lang === "ar" ? "طلبات غير مقروءة" : "Unread Applications",
      value: data?.unseenApplications ?? 0,
      icon: Eye,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/20",
      border: "border-amber-200 dark:border-amber-800",
    },
    {
      title: lang === "ar" ? "معدل التحويل" : "Conversion Rate",
      value: `${totalConversionRate}%`,
      icon: MousePointerClick,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/20",
      border: "border-violet-200 dark:border-violet-800",
    },
  ];

  const barData = jobs.map((j) => ({
    name: j.title.length > 20 ? j.title.slice(0, 20) + "…" : j.title,
    fullTitle: j.title,
    [lang === "ar" ? "الطلبات" : "Applications"]: j.applicationsCount,
    [lang === "ar" ? "غير مقروءة" : "Unread"]: j.unseenApplicationsCount,
    [lang === "ar" ? "المشاهدات" : "Views"]: j.viewsCount,
  }));

  const pieData = jobs
    .filter((j) => j.applicationsCount > 0)
    .map((j, i) => ({
      name: j.title.length > 18 ? j.title.slice(0, 18) + "…" : j.title,
      value: j.applicationsCount,
      color: COLORS[i % COLORS.length],
    }));

  const trendData = trends.map((t) => ({
    week: formatWeek(t.week, lang),
    [lang === "ar" ? "الطلبات" : "Applications"]: t.count,
  }));

  // Job performance table
  const performanceData = jobs.map((j) => ({
    ...j,
    nameShort: j.title.length > 22 ? j.title.slice(0, 22) + "…" : j.title,
    [lang === "ar" ? "معدل التحويل" : "Conversion %"]: j.conversionRate,
    [lang === "ar" ? "المشاهدات" : "Views"]: j.viewsCount,
  }));

  return (
    <div className="container py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <BarChart2 className="h-7 w-7 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {lang === "ar" ? "لوحة التحليلات" : "Analytics Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-0.5">
            {lang === "ar"
              ? "إحصائيات مفصّلة لوظائفك، طلبات التوظيف، ومعايير الرواتب"
              : "Detailed stats for your jobs, applications, and salary benchmarks"}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {statCards.map((s, i) => (
          <Card key={i} className={`${s.border} ${s.bg}`}>
            <CardContent className="p-3 sm:p-5 flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-white/60 dark:bg-black/20 rounded-xl shrink-0">
                <s.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground leading-tight break-words">{s.title}</p>
                <p className={`text-2xl sm:text-3xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center flex flex-col items-center">
            <Briefcase className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="font-medium text-muted-foreground">
              {lang === "ar" ? "لا توجد وظائف بعد" : "No jobs yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Application Trends */}
          {trendData.length > 0 && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {lang === "ar" ? "اتجاهات الطلبات (آخر 8 أسابيع)" : "Application Trends (Last 8 Weeks)"}
                </CardTitle>
                <CardDescription>
                  {lang === "ar"
                    ? "عدد الطلبات الواردة لكل أسبوع"
                    : "Number of applications received per week"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <defs>
                      <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={lang === "ar" ? "الطلبات" : "Applications"}
                      stroke="#4f46e5"
                      strokeWidth={2}
                      fill="url(#appGradient)"
                      dot={{ r: 4, fill: "#4f46e5" }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Bar chart: Applications per job */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {lang === "ar" ? "الطلبات لكل وظيفة" : "Applications per Job"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barData}
                  margin={{ top: 5, right: 10, left: -15, bottom: 60 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    labelFormatter={(label) => {
                      const job = barData.find((d) => d.name === label);
                      return job?.fullTitle ?? label;
                    }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
                  <Bar dataKey={lang === "ar" ? "الطلبات" : "Applications"} fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={lang === "ar" ? "غير مقروءة" : "Unread"} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Job Performance + Pie */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Conversion Rate per Job */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4 text-emerald-500" />
                  {lang === "ar" ? "معدل التحويل (طلبات / مشاهدات)" : "Conversion Rate (Applications / Views)"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={performanceData}
                    margin={{ top: 0, right: 5, left: -20, bottom: 0 }}
                    barSize={14}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis
                      type="number"
                      unit="%"
                      tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <YAxis
                      type="category"
                      dataKey="nameShort"
                      tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 11 }}
                      formatter={(v: any) => [`${v}%`, lang === "ar" ? "معدل التحويل" : "Conversion"]}
                    />
                    <Bar
                      dataKey={lang === "ar" ? "معدل التحويل" : "Conversion %"}
                      fill="#10b981"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie chart: Distribution */}
            {pieData.length > 0 ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    {lang === "ar" ? "توزيع الطلبات" : "Application Distribution"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-violet-500" />
                    {lang === "ar" ? "مشاهدات الوظائف" : "Job Views"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData} margin={{ top: 0, right: 5, left: -20, bottom: 0 }} barSize={14}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} />
                      <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 11 }} />
                      <Bar dataKey={lang === "ar" ? "المشاهدات" : "Views"} fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Salary Benchmarks */}
          {benchmarks.length > 0 && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-500" />
                  {lang === "ar" ? "معايير الرواتب مقارنةً بالسوق" : "Salary Benchmarks vs. Market"}
                </CardTitle>
                <CardDescription>
                  {lang === "ar"
                    ? "مقارنة رواتبك مع متوسط الرواتب في نفس التصنيف على المنصة"
                    : "Your salary ranges compared to platform-wide averages in the same category"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-xs">
                        <th className="text-start py-2 px-3 font-medium">
                          {lang === "ar" ? "التصنيف" : "Category"}
                        </th>
                        <th className="text-start py-2 px-3 font-medium">
                          {lang === "ar" ? "راتبك" : "Your Range"}
                        </th>
                        <th className="text-start py-2 px-3 font-medium">
                          {lang === "ar" ? "متوسط السوق" : "Market Avg"}
                        </th>
                        <th className="text-start py-2 px-3 font-medium">
                          {lang === "ar" ? "الوضع" : "Position"}
                        </th>
                        <th className="text-start py-2 px-3 font-medium">
                          {lang === "ar" ? "وظائف في السوق" : "Market Jobs"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {benchmarks.map((b) => {
                        const yourMid = b.yourMin != null && b.yourMax != null ? (b.yourMin + b.yourMax) / 2 : null;
                        const platformMid = (b.platformAvgMin + b.platformAvgMax) / 2;
                        const diff = yourMid != null ? Math.round(((yourMid - platformMid) / platformMid) * 100) : null;
                        return (
                          <tr key={b.category} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-3 font-medium">{b.category}</td>
                            <td className="py-3 px-3 text-muted-foreground">
                              {b.yourMin != null && b.yourMax != null
                                ? `${b.yourMin.toLocaleString()}–${b.yourMax.toLocaleString()} ${b.currency}`
                                : <span className="text-muted-foreground/50 text-xs">{lang === "ar" ? "غير محدد" : "Not set"}</span>}
                            </td>
                            <td className="py-3 px-3 text-muted-foreground">
                              {b.platformAvgMin.toLocaleString()}–{b.platformAvgMax.toLocaleString()} {b.currency}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <SalaryCompareIcon yourMid={yourMid} platformMid={platformMid} />
                                {diff != null ? (
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] ${
                                      diff > 0
                                        ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20"
                                        : diff < 0
                                        ? "text-red-600 border-red-200 bg-red-50 dark:bg-red-950/20"
                                        : "text-amber-600 border-amber-200 bg-amber-50"
                                    }`}
                                  >
                                    {diff > 0 ? `+${diff}%` : diff < 0 ? `${diff}%` : lang === "ar" ? "معادل" : "Equal"}
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground/50">—</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-muted-foreground text-xs">{b.platformJobCount}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3 text-emerald-500" />
                  {lang === "ar"
                    ? "أعلى من المتوسط — جذاب للمرشحين"
                    : "Above market average — attractive to candidates"}
                  <span className="mx-2">·</span>
                  <ArrowDown className="h-3 w-3 text-red-500" />
                  {lang === "ar" ? "أقل من المتوسط — قد يقلل عدد الطلبات" : "Below market — may reduce applications"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Job Performance Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                {lang === "ar" ? "أداء الوظائف التفصيلي" : "Detailed Job Performance"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs">
                      <th className="text-start py-2 px-3 font-medium">{lang === "ar" ? "الوظيفة" : "Job"}</th>
                      <th className="text-start py-2 px-3 font-medium">{lang === "ar" ? "الحالة" : "Status"}</th>
                      <th className="text-end py-2 px-3 font-medium">{lang === "ar" ? "الطلبات" : "Applications"}</th>
                      <th className="text-end py-2 px-3 font-medium">{lang === "ar" ? "المشاهدات" : "Views"}</th>
                      <th className="text-end py-2 px-3 font-medium">{lang === "ar" ? "التحويل" : "Conversion"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((j) => (
                      <tr key={j.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-medium truncate max-w-[180px]">{j.title}</div>
                          <div className="text-xs text-muted-foreground">{j.category}</div>
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              j.isOpen
                                ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20"
                                : "text-muted-foreground border-border"
                            }`}
                          >
                            {j.isOpen
                              ? lang === "ar" ? "مفتوحة" : "Open"
                              : lang === "ar" ? "مغلقة" : "Closed"}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-end font-medium">{j.applicationsCount}</td>
                        <td className="py-3 px-3 text-end text-muted-foreground">{j.viewsCount}</td>
                        <td className="py-3 px-3 text-end">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              j.conversionRate >= 10
                                ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20"
                                : j.conversionRate >= 3
                                ? "text-amber-600 border-amber-200 bg-amber-50"
                                : "text-muted-foreground border-border"
                            }`}
                          >
                            {j.conversionRate}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
