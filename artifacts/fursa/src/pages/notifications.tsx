import { Link, useLocation } from "wouter";
import {
  useListMyNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  getListMyNotificationsQueryKey,
  getGetUnreadNotificationCountQueryKey,
} from "@workspace/api-client-react";
import type { Notification } from "@workspace/api-client-react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { localizeNotif } from "@/lib/notifLocalize";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Bell,
  BellOff,
  Users,
  ChevronLeft,
  CheckCheck,
  Briefcase,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

function NotificationIcon({ type }: { type: string }) {
  const cls = "h-5 w-5";
  switch (type) {
    case "job_approved":
      return <CheckCircle2 className={`${cls} text-green-500`} />;
    case "job_rejected":
      return <XCircle className={`${cls} text-red-500`} />;
    case "application_received":
      return <Users className={`${cls} text-blue-500`} />;
    case "application_accepted":
      return <CheckCircle2 className={`${cls} text-green-500`} />;
    case "application_rejected":
      return <XCircle className={`${cls} text-orange-500`} />;
    default:
      return <Bell className={`${cls} text-muted-foreground`} />;
  }
}

function iconBg(type: string, read: boolean): string {
  if (read) return "bg-muted";
  switch (type) {
    case "job_approved":
    case "application_accepted":
      return "bg-green-50";
    case "job_rejected":
      return "bg-red-50";
    case "application_received":
      return "bg-blue-50";
    case "application_rejected":
      return "bg-orange-50";
    default:
      return "bg-primary/10";
  }
}

export default function NotificationsPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useListMyNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const handleClick = (n: Notification) => {
    if (!n.read) {
      markReadMutation.mutate(
        { id: n.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getListMyNotificationsQueryKey(),
            });
            queryClient.invalidateQueries({
              queryKey: getGetUnreadNotificationCountQueryKey(),
            });
            if (n.link) setLocation(n.link);
          },
        },
      );
    } else if (n.link) {
      setLocation(n.link);
    }
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListMyNotificationsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetUnreadNotificationCountQueryKey(),
        });
        toast.success(t("notifications.markAllRead"));
      },
    });
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            asChild
          >
            <Link href="/">
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("notifications.page.title")}
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {unreadCount} {t("notifications.page.unread")}
              </p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={markAllReadMutation.isPending}
            className="gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            {t("notifications.markAllRead")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex gap-3 p-4 rounded-xl border bg-card animate-pulse"
            >
              <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-1.5">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-start cursor-pointer ${
                n.read
                  ? "bg-card hover:bg-muted/30 border-border"
                  : "bg-primary/5 hover:bg-primary/10 border-primary/20"
              } ${n.link ? "cursor-pointer" : "cursor-default"}`}
            >
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${iconBg(n.type, n.read)}`}
              >
                <NotificationIcon type={n.type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm font-medium leading-snug ${n.read ? "text-foreground/80" : "text-foreground"}`}
                  >
                    {localizeNotif(n.title, lang)}
                  </p>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {localizeNotif(n.body, lang)}
                </p>
                <p className="text-xs text-muted-foreground/50 mt-1.5">
                  {formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                    locale,
                  })}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <BellOff className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-semibold">{t("notifications.empty")}</h3>
          <p className="text-muted-foreground max-w-xs">
            {t("notifications.page.emptyDesc")}
          </p>
        </div>
      )}
    </div>
  );
}
