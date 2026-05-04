import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/react";

type AdminEvent =
  | { type: "job_posted"; data: { title: string; employer: string } }
  | { type: "application_submitted"; data: { jobTitle: string; applicant: string } }
  | { type: "job_approved"; data: { title: string } }
  | { type: "job_rejected"; data: { title: string } };

type AdminStreamEvent = AdminEvent & { receivedAt: number };

export function useAdminDashboardStream(onEvent: (e: AdminStreamEvent) => void) {
  const { getToken } = useAuth();
  const esRef = useRef<EventSource | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connect = useCallback(async () => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    try {
      const token = await getToken();
      const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
      const url = `${basePath}/api/admin/dashboard/stream${token ? `?token=${encodeURIComponent(token)}` : ""}`;
      const es = new EventSource(url);
      esRef.current = es;

      const handler = (eventName: string) => (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          onEventRef.current({ type: eventName as any, data, receivedAt: Date.now() });
        } catch {}
      };

      es.addEventListener("job_posted", handler("job_posted"));
      es.addEventListener("application_submitted", handler("application_submitted"));
      es.addEventListener("job_approved", handler("job_approved"));
      es.addEventListener("job_rejected", handler("job_rejected"));

      es.onerror = () => {
        es.close();
        esRef.current = null;
        setTimeout(connect, 5000);
      };
    } catch {}
  }, [getToken]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, [connect]);
}
