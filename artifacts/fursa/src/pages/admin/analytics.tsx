import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { useGetCurrentUser } from "@workspace/api-client-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, Briefcase, FileText, Users, TrendingUp } from "lucide-react";

function apiUrl(path: string) {
  const base = (import.meta.env.BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  return `${base}/api/${path}`;
}

async function authFetch(getToken: () => Promise<string | null>, url: string) {
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(url, { headers });
}

interface DayPoint {
  day: string;
  jobs: number;
  applications: number;
  users: number;
}

function formatDay(day: string, lang: string) {
  const d = new Date(day + "T00:00:00");
  return d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { month: "short", day: "numeric" });
}

function sum(data: DayPoint[], key: keyof Omit<DayPoint, "day">) {
  return data.reduce((acc, d) => acc + d[key], 0);
}

export default function AdminAnalyticsPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const { getToken } = useAuth();
  const { data: dbUser } = useGetCurrentUser();

  const { data, isLoading } = useQuery<{ daily: DayPoint[] }>({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await authFetch(getToken, apiUrl("admin/analytics"));
      if (!res.ok) throw new Error("Failed to load analytics");
      return res.json();
    },
    enabled: dbUser?.role === "admin",
    staleTime: 5 * 60 * 1000,
  });

  const daily = (data?.daily ?? []).map((d) => ({
    ...d,
    label: formatDay(d.day, lang),
  }));

  const totals = {
    jobs: sum(data?.daily ?? [], "jobs"),
    applications: sum(data?.daily ?? [], "applications"),
    users: sum(data?.daily ?? [], "users"),
  };

  const COLORS = {
    jobs: "#4f46e5",
    applications: "#10b981",
    users: "#f59e0b",
  };

  if (isLoading) {
    return (
      <div className="container py-8 max-w-6xl space-y-6">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-72 rounded-xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <BarChart2 className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("admin.analytics.pageTitle")}</h1>
          <p className="text-muted-foreground mt-0.5">{t("admin.analytics.pageSubtitle")}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("admin.analytics.chartJobs")}</p>
              <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{totals.jobs}</p>
              <p className="text-xs text-muted-foreground">{t("admin.analytics.last30")}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("admin.analytics.chartApps")}</p>
              <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{totals.applications}</p>
              <p className="text-xs text-muted-foreground">{t("admin.analytics.last30")}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
              <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("admin.analytics.chartUsers")}</p>
              <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{totals.users}</p>
              <p className="text-xs text-muted-foreground">{t("admin.analytics.last30")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Combined area chart — full 30 days */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            {t("admin.analytics.weekly")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={daily} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradJobs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.jobs} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={COLORS.jobs} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.applications} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={COLORS.applications} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.users} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={COLORS.users} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickLine={false}
                interval={4}
              />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="jobs"
                name={t("admin.analytics.chartJobs")}
                stroke={COLORS.jobs}
                strokeWidth={2}
                fill="url(#gradJobs)"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="applications"
                name={t("admin.analytics.chartApps")}
                stroke={COLORS.applications}
                strokeWidth={2}
                fill="url(#gradApps)"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="users"
                name={t("admin.analytics.chartUsers")}
                stroke={COLORS.users}
                strokeWidth={2}
                fill="url(#gradUsers)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two smaller charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Jobs per day bar chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-500" />
              {t("admin.analytics.chartJobs")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={daily} margin={{ top: 0, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} interval={6} />
                <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11 }} />
                <Bar dataKey="jobs" name={t("admin.analytics.chartJobs")} fill={COLORS.jobs} radius={[3, 3, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Applications line chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-500" />
              {t("admin.analytics.chartApps")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={daily} margin={{ top: 0, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} interval={6} />
                <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="applications"
                  name={t("admin.analytics.chartApps")}
                  stroke={COLORS.applications}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
