import { useState } from "react";
import { Link } from "wouter";
import {
  useListAdminUsers,
  useToggleUserActive,
  getListAdminUsersQueryKey,
} from "@workspace/api-client-react";
import { ListAdminUsersRole } from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Users,
  ChevronLeft,
  Mail,
  MapPin,
  Briefcase,
  FileText,
  Ban,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const ALL = "all";

export default function AdminUsers() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;
  const queryClient = useQueryClient();

  const [roleFilter, setRoleFilter] = useState<ListAdminUsersRole | typeof ALL>(
    ALL,
  );

  const { data: users, isLoading } = useListAdminUsers({
    role: roleFilter === ALL ? undefined : roleFilter,
  });

  const toggleActiveMutation = useToggleUserActive({
    mutation: {
      onSuccess: () => {
        toast.success(t("admin.users.toggleSuccess"));
        queryClient.invalidateQueries({
          queryKey: getListAdminUsersQueryKey(),
        });
      },
      onError: () => toast.error(t("common.error")),
    },
  });

  const handleToggleActive = (id: string) => {
    toggleActiveMutation.mutate({ data: { id } });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground"
          >
            {t("admin.users.roleAdmin")}
          </Badge>
        );
      case "employer":
        return (
          <Badge
            variant="secondary"
            className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200"
          >
            {t("admin.users.roleEmployer")}
          </Badge>
        );
      case "seeker":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-800 border-emerald-200"
          >
            {t("admin.users.roleSeeker")}
          </Badge>
        );
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full hidden sm:flex"
          >
            <Link href="/admin">
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("admin.users.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("admin.users.subtitle")}
            </p>
          </div>
        </div>

        <Select
          value={roleFilter}
          onValueChange={(val) =>
            setRoleFilter(val as ListAdminUsersRole | typeof ALL)
          }
        >
          <SelectTrigger className="w-full sm:w-[200px] bg-background">
            <SelectValue placeholder={t("admin.users.filterRole")} />
          </SelectTrigger>
          <SelectContent dir={lang === "ar" ? "rtl" : "ltr"}>
            <SelectItem value={ALL}>{t("admin.users.filterAll")}</SelectItem>
            <SelectItem value="seeker">
              {t("admin.users.filterSeekers")}
            </SelectItem>
            <SelectItem value="employer">
              {t("admin.users.filterEmployers")}
            </SelectItem>
            <SelectItem value="admin">
              {t("admin.users.filterAdmins")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))
        ) : users && users.length > 0 ? (
          users.map((user) => (
            <Card
              key={user.id}
              className={`border-border/50 ${
                !user.isActive ? "bg-muted/50 border-dashed" : ""
              }`}
            >
              <CardContent className="p-5 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 min-w-0 space-y-3 w-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3
                          className={`text-xl font-bold ${
                            !user.isActive
                              ? "text-muted-foreground line-through"
                              : ""
                          }`}
                        >
                          {user.name}
                        </h3>
                        {getRoleBadge(user.role)}
                        {!user.isActive && (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1 text-[10px] px-1.5 py-0 h-5"
                          >
                            <Ban className="h-3 w-3" /> {t("admin.users.banned")}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 mr-1 ms-1 opacity-70" />
                        <span dir="ltr">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    {user.phone && (
                      <div className="flex items-center text-muted-foreground">
                        <span dir="ltr" className="font-mono">
                          {user.phone}
                        </span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-1 ms-1 opacity-70" />
                        {user.location}
                      </div>
                    )}
                    {user.role === "employer" && (
                      <div className="flex items-center text-indigo-700 font-medium">
                        <Briefcase className="h-3.5 w-3.5 mr-1 ms-1 opacity-70" />
                        {user.jobsCount} {t("admin.users.jobsPosted")}
                      </div>
                    )}
                    {user.role === "seeker" && (
                      <div className="flex items-center text-emerald-700 font-medium">
                        <FileText className="h-3.5 w-3.5 mr-1 ms-1 opacity-70" />
                        {user.applicationsCount} {t("admin.users.appsCount")}
                      </div>
                    )}
                    <div className="text-muted-foreground text-xs">
                      {t("admin.users.joinedAt", {
                        date: formatDistanceToNow(new Date(user.createdAt), {
                          addSuffix: true,
                          locale,
                        }),
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center justify-center gap-3 shrink-0 md:w-40 border-t md:border-t-0 md:border-r rtl:md:border-l rtl:md:border-r-0 border-border/50 pt-4 md:pt-0 w-full md:w-auto">
                  {user.role !== "admin" ? (
                    <div className="flex flex-col items-center justify-center w-full gap-2 bg-muted/30 p-3 rounded-lg">
                      <Label
                        htmlFor={`active-${user.id}`}
                        className={`text-sm cursor-pointer ${
                          user.isActive ? "text-green-600" : "text-destructive"
                        }`}
                      >
                        {user.isActive
                          ? t("admin.users.statusActive")
                          : t("admin.users.statusBanned")}
                      </Label>
                      <Switch
                        id={`active-${user.id}`}
                        checked={user.isActive}
                        onCheckedChange={() => handleToggleActive(user.id)}
                        disabled={toggleActiveMutation.isPending}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center p-3">
                      {t("admin.users.cantBanAdmin")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-12 text-center flex flex-col items-center">
              <Users className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("admin.users.empty")}
              </h3>
              <p className="text-muted-foreground">
                {t("admin.users.emptyDesc")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
