"use client";

import { AdminDashboard } from "@/components/organisms/AdminDashboard/AdminDashboard";
import { AdminLogin } from "@/components/organisms/AdminLogin/AdminLogin";
import { useAppSelector } from "@/store/hooks";

export function AdminTemplate() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
