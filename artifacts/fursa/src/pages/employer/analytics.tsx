import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { useT, useLanguageStore } from "@/lib/i18n";
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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, Briefcase, Users, FileText, TrendingUp, Eye } from "lucide-react";

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
  status: string;
  isOpen: boolean;
}

interface EmployerAnalytics {
  totalJobs: number;
  totalApplications: number;
  totalViews: number;
  unseenApplications: number;
  jobs: JobStat[];
}

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function EmployerAnalyticsPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const { getToken } = useAuth();
  const { data: dbUser } = useGetCurrentUser();

  const { data, isLoading } = useQuery<EmployerAnalytics>({
    queryKey: ["employer-analytics"],
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
      </div>
    );
  }

  const jobs = data?.jobs ?? [];

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
      title: lang === "ar" ? "إجمالي المشاهدات" : "Total Views",
      value: data?.totalViews ?? 0,
      icon: TrendingUp,
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

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <BarChart2 className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {lang === "ar" ? "تحليلات الوظائف" : "Job Analytics"}
          </h1>
          <p className="text-muted-foreground mt-0.5">
            {lang === "ar" ? "إحصائيات مفصّلة لوظائفك وطلبات التوظيف" : "Detailed stats for your jobs and applications"}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <Card key={i} className={`${s.border} ${s.bg}`}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 bg-white/60 dark:bg-black/20 rounded-xl`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.title}</p>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
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
                  margin={{ top: 5, right: 10, left: -15, bottom: lang === "ar" ? 60 : 60 }}
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
                  <Bar
                    dataKey={lang === "ar" ? "الطلبات" : "Applications"}
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey={lang === "ar" ? "غير مقروءة" : "Unread"}
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pie chart: Distribution */}
            {pieData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" />
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
            )}

            {/* Views per job */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-violet-500" />
                  {lang === "ar" ? "مشاهدات الوظائف" : "Job Views"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={barData}
                    margin={{ top: 0, right: 5, left: -20, bottom: 0 }}
                    barSize={14}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 11 }} />
                    <Bar
                      dataKey={lang === "ar" ? "المشاهدات" : "Views"}
                      fill="#8b5cf6"
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
