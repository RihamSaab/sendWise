
"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";

import theme from "@/styles/theme";

export default function DashboardHeader() {
  const pathname = usePathname();

  const pageTitle =
    pathname === "/dashboard"
      ? "Overview"
      : pathname
          .split("/")
          .filter(Boolean)
          .at(-1)
          ?.replace(/-/g, " ")
          .replace(/\b\w/g, (character) => character.toUpperCase()) ??
        "Dashboard";

  return (
    <Header>
      <PageTitle>{pageTitle}</PageTitle>

      <HeaderLabel>Personal workspace</HeaderLabel>
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  min-height: 76px;
  padding: ${theme.spacing.lg} 40px;
  border-bottom: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};

  @media (max-width: 768px) {
    padding: ${theme.spacing.md} 24px;
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.md} 16px;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  color: ${theme.colors.text};
  font-size: 1.35rem;
  font-weight: 650;
  letter-spacing: -0.04em;
`;

const HeaderLabel = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.85rem;

  @media (max-width: 480px) {
    display: none;
  }
`;
