import type { ReactNode } from "react";
import Sidebar from "./components/sidebar";
import styled from "styled-components";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <StyledDashboardLayout>
      <Sidebar />

      <StyledDashboardLayout_Content>{children}</StyledDashboardLayout_Content>
    </StyledDashboardLayout>
  );
}

const StyledDashboardLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--color-background);

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const StyledDashboardLayout_Content = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 100vh;

  @media (max-width: 640px) {
    min-height: auto;
  }
`;
