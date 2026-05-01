import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListMyNotifications,
  useGetUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  getListMyNotificationsQueryKey,
  getGetUnreadNotificationCountQueryKey,
  type Notification,
} from "@workspace/api-client-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const t = useT();
  const { lang } = useLanguageStore();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: countData } = useGetUnreadNotificationCount({
    query: { refetchInterval: 30_000, refetchOnWindowFocus: true },
  });
  const { data: notifications } = useListMyNotifications({
    query: { refetchInterval: 30_000, refetchOnWindowFocus: true },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: getListMyNotificationsQueryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: getGetUnreadNotificationCountQueryKey(),
    });
  };

  const markRead = useMarkNotificationRead({
    mutation: { onSuccess: invalidate },
  });
  const markAllRead = useMarkAllNotificationsRead({
    mutation: { onSuccess: invalidate },
  });

  const unread = countData?.count ?? 0;
  const items = notifications ?? [];

  const handleClick = (n: Notification) => {
    if (!n.read) markRead.mutate({ id: n.id });
    if (n.link) navigate(n.link);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={t("notifications.title")}
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -end-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">
            {t("notifications.title")}
          </h3>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="mr-1 ms-1 h-3.5 w-3.5" />
              {t("notifications.markAllRead")}
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-96">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center text-muted-foreground">
              <Bell className="mb-3 h-10 w-10 opacity-30" />
              <p className="text-sm">{t("notifications.empty")}</p>
            </div>
          ) : (
            <ul className="divide-y">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(n)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-start transition-colors hover:bg-accent",
                      !n.read && "bg-primary/5",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full",
                        n.read ? "bg-transparent" : "bg-primary",
                      )}
                    />
                    <div className="flex-1 space-y-1">
                      <p
                        className={cn(
                          "text-sm leading-snug",
                          !n.read && "font-semibold",
                        )}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-snug">
                        {n.body}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                          locale: lang === "ar" ? ar : enUS,
                        })}
                      </p>
                    </div>
                    {!n.read && (
                      <Check className="h-4 w-4 text-primary opacity-0" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
