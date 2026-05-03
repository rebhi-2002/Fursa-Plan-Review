import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/react";
import {
  getListMyNotificationsQueryKey,
  getGetUnreadNotificationCountQueryKey,
} from "@workspace/api-client-react";

const RECONNECT_DELAY_MS = 5_000;
const MAX_RECONNECT_DELAY_MS = 60_000;

export function useNotificationStream() {
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectDelayRef = useRef(RECONNECT_DELAY_MS);

  useEffect(() => {
    if (!isSignedIn) return;

    const base = (import.meta.env.BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
    const url = `${base}/api/me/notifications/stream`;

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: getListMyNotificationsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetUnreadNotificationCountQueryKey() });
    };

    const connect = () => {
      const es = new EventSource(url, { withCredentials: true });
      esRef.current = es;

      es.addEventListener("notification", () => {
        invalidate();
        reconnectDelayRef.current = RECONNECT_DELAY_MS;
      });

      es.addEventListener("open", () => {
        reconnectDelayRef.current = RECONNECT_DELAY_MS;
      });

      es.onerror = () => {
        es.close();
        esRef.current = null;
        const delay = reconnectDelayRef.current;
        reconnectDelayRef.current = Math.min(delay * 2, MAX_RECONNECT_DELAY_MS);
        reconnectTimerRef.current = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      esRef.current?.close();
      esRef.current = null;
    };
  }, [isSignedIn, queryClient]);
}
