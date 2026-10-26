import type { ReactNode } from "react";
import styled from "styled-components";

import LandingFooter from "@/modules/landing/components/LandingFooter";
import DashboardHeader from "./components/dashboardHeader";
import Sidebar from "./components/sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <StyledDashboardLayout>
      <Sidebar />

      <StyledDashboardLayout_Content>
        <DashboardHeader />
        <StyledDashboardLayout_Main>{children}</StyledDashboardLayout_Main>
        <LandingFooter />
      </StyledDashboardLayout_Content>
    </StyledDashboardLayout>
  );
}

const StyledDashboardLayout = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 100vh;
  background: var(--color-background);

  > aside {
    flex: 0 0 250px;
  }

  @media (max-width: 640px) {
    flex-direction: column;

    > aside {
      flex: 0 0 auto;
    }
  }
`;

const StyledDashboardLayout_Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
`;

const StyledDashboardLayout_Main = styled.div`
  flex: 1;
  min-width: 0;
`;
