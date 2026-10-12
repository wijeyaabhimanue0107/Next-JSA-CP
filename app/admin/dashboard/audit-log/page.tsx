"use client";

import AdminShell from "@/components/AdminShell";
import { getAuditLog } from "@/data/auditLog";
import { useState } from "react";

export default function AuditLogPage() {
  const [entries] = useState(getAuditLog);
  return <AdminShell><section className="admin-content"><div className="section-heading"><div><div className="eyebrow">ACCOUNTABILITY</div><h2>Audit log</h2></div></div><div className="table-wrap"><table><thead><tr><th>Timestamp</th><th>Admin</th><th>Action</th><th>Target</th></tr></thead><tbody>{entries.map((entry) => <tr key={`${entry.timestamp}-${entry.target}`}><td>{entry.timestamp}</td><td>{entry.admin}</td><td>{entry.action}</td><td>{entry.target}</td></tr>)}</tbody></table></div></section></AdminShell>;
}
