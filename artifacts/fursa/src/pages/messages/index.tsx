import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { useListMessageThreads } from "@workspace/api-client-react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, ChevronLeft, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function MessagesPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;

  const { data: threads, isLoading } = useListMessageThreads();

  return (
    <div className="container py-8 max-w-3xl">
      <Helmet>
        <title>{lang === "ar" ? "الرسائل | فُرصة" : "Messages | Fursa"}</title>
      </Helmet>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("messages.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("messages.threads")}</p>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : threads && (threads as any[]).length > 0 ? (
          (threads as any[]).map((thread) => (
            <Link key={thread.userId} href={`/messages/${thread.userId}`}>
              <Card className="border-border/50 hover:shadow-md transition-all cursor-pointer hover:border-primary/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm">{thread.userName}</span>
                      {thread.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 h-4 min-w-[16px] flex items-center justify-center">
                          {thread.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                  </div>
                  {thread.lastMessageAt && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDistanceToNow(new Date(thread.lastMessageAt), {
                        addSuffix: true,
                        locale,
                      })}
                    </span>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-16 text-center flex flex-col items-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("messages.empty")}</h3>
              <p className="text-muted-foreground">{t("messages.emptyDesc")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
