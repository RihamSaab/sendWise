import type { ReactNode } from "react";
import DashboardLayout from "./dashboardLayout";

type DashboardRouteLayoutProps = {
  children: ReactNode;
};

export default function DashboardRouteLayout({
  children,
}: DashboardRouteLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
