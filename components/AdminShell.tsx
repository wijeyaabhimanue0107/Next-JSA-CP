"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const tabs = [
  ["Overview", "/admin/dashboard"],
  ["Bookings", "/admin/dashboard/bookings"],
  ["Schedule", "/admin/dashboard/schedule"],
  ["Facilities", "/admin/dashboard/facilities"],
  ["Audit log", "/admin/dashboard/audit-log"],
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem("jsa-admin-auth") !== "true") {
      router.replace("/admin/login");
    }
  }, [router]);

  function logout() {
    sessionStorage.removeItem("jsa-admin-auth");
    router.replace("/admin/login");
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><div className="eyebrow">JSA PLAY · MANAGEMENT</div><h1>Management dashboard</h1></div>
        <div className="admin-user">Admin <button type="button" onClick={logout}>Log out</button></div>
      </header>
      <nav className="admin-tabs" aria-label="Admin navigation">
        {tabs.map(([label, href]) => <Link className={pathname === href ? "active" : ""} href={href} key={href}>{label}</Link>)}
      </nav>
      {children}
    </main>
  );
}
