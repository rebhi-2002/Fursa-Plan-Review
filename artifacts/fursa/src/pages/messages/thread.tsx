import { Helmet } from "react-helmet-async";
import { useState, useRef, useEffect } from "react";
import { Link, useRoute } from "wouter";
import {
  useGetMessages,
  useSendMessage,
  getGetMessagesQueryKey,
  getListMessageThreadsQueryKey,
} from "@workspace/api-client-react";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Send, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function MessageThread() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;
  const [, params] = useRoute("/messages/:userId");
  const userId = params?.userId ?? "";
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [body, setBody] = useState("");

  const { data: messages, isLoading } = useGetMessages(userId, {
    query: { enabled: !!userId, queryKey: getGetMessagesQueryKey(userId) },
  });
  const { data: currentUser } = useGetCurrentUser();

  const sendMutation = useSendMessage({
    mutation: {
      onSuccess: () => {
        setBody("");
        queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(userId) });
        queryClient.invalidateQueries({ queryKey: getListMessageThreadsQueryKey() });
      },
      onError: () => toast.error(t("common.error")),
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!body.trim()) return;
    sendMutation.mutate({ userId, data: { body: body.trim() } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const msgList = (messages as any[]) ?? [];
  const otherName = msgList.find((m: any) => m.senderId !== currentUser?.id)?.senderName;

  return (
    <div className="container py-8 max-w-2xl flex flex-col h-[calc(100vh-8rem)]">
      <Helmet>
        <title>{lang === "ar" ? "المحادثة | فُرصة" : "Conversation | Fursa"}</title>
      </Helmet>
      <div className="mb-4 flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/messages">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">{otherName ?? "..."}</h1>
          <p className="text-xs text-muted-foreground">{t("messages.back")}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 py-4 px-1">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className={`h-10 w-3/4 rounded-2xl ${i % 2 === 0 ? "" : "ms-auto"}`} />
          ))
        ) : msgList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="h-14 w-14 text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground">{t("messages.conversationEmpty")}</p>
          </div>
        ) : (
          msgList.map((msg: any) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.body}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMe ? "text-primary-foreground/70 text-end" : "text-muted-foreground"
                    }`}
                  >
                    {format(new Date(msg.createdAt), "p", { locale })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 pt-3 border-t flex gap-2">
        <textarea
          dir="auto"
          className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px] max-h-32"
          placeholder={t("messages.placeholder")}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <Button
          size="icon"
          className="h-11 w-11 rounded-xl shrink-0"
          onClick={handleSend}
          disabled={sendMutation.isPending || !body.trim()}
          aria-label={t("messages.send")}
        >
          <Send className="h-4 w-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}
