import type { ReactNode } from "react";
import DashboardLayout from "@/modules/dashboard/dashboardLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
