export interface AuditEntry {
  timestamp: string;
  admin: string;
  action: string;
  target: string;
}

export const seedAuditLog: AuditEntry[] = [
  { timestamp: "2026-10-09 05:32", admin: "admin", action: "Confirmed booking", target: "JSA-8916 · Football Play Area" },
  { timestamp: "2026-10-08 14:10", admin: "manager", action: "Edited facility rate", target: "Badminton Court 1" },
  { timestamp: "2026-10-07 09:45", admin: "admin", action: "Added maintenance lock", target: "Cricket Net 3 · 18:00 – 20:00" },
];

export function addAuditEntry(action: string, target: string) {
  const current = JSON.parse(sessionStorage.getItem("jsa-audit-log") ?? "[]") as AuditEntry[];
  current.unshift({ timestamp: new Date().toISOString().slice(0, 16).replace("T", " "), admin: "admin", action, target });
  sessionStorage.setItem("jsa-audit-log", JSON.stringify(current));
}

export function getAuditLog() {
  if (typeof window === "undefined") return seedAuditLog;
  const stored = sessionStorage.getItem("jsa-audit-log");
  return stored ? [...(JSON.parse(stored) as AuditEntry[]), ...seedAuditLog] : seedAuditLog;
}
