import type { Response } from "express";

const adminClients = new Set<Response>();

export function addAdminSseClient(res: Response): void {
  adminClients.add(res);
}

export function removeAdminSseClient(res: Response): void {
  adminClients.delete(res);
}

export function broadcastAdminEvent(event: string, data: unknown): void {
  if (adminClients.size === 0) return;
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of adminClients) {
    try {
      res.write(payload);
    } catch {
      adminClients.delete(res);
    }
  }
}
