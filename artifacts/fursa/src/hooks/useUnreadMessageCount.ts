import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/react";
import { useEffect, useRef } from "react";

export const UNREAD_MESSAGE_COUNT_KEY = ["unread-message-count"];

async function fetchUnreadCount(): Promise<number> {
  const base = (import.meta.env.BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  const res = await fetch(`${base}/api/me/messages/unread-count`, { credentials: "include" });
  if (!res.ok) return 0;
  const data = (await res.json()) as { total: number };
  return data.total ?? 0;
}

export function useUnreadMessageCount(): number {
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource | null>(null);

  const { data: count = 0 } = useQuery({
    queryKey: UNREAD_MESSAGE_COUNT_KEY,
    queryFn: fetchUnreadCount,
    enabled: !!isSignedIn,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  useEffect(() => {
    if (!isSignedIn) return;
    const base = (import.meta.env.BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
    const url = `${base}/api/me/notifications/stream`;

    const es = new EventSource(url, { withCredentials: true });
    esRef.current = es;

    const invalidate = () => {
      void queryClient.invalidateQueries({ queryKey: UNREAD_MESSAGE_COUNT_KEY });
    };

    es.addEventListener("new_message", invalidate);
    es.addEventListener("notification", invalidate);

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [isSignedIn, queryClient]);

  return count;
}
