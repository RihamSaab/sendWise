
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
  min-height: 72px;
  padding: ${theme.spacing.lg} ${theme.spacing["2xl"]};
  background: ${theme.gradient.surface};
  box-shadow: 0 1px 0 ${theme.colors.border};

  @media (max-width: 768px) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.md};
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  color: ${theme.colors.text};
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.03em;
`;

const HeaderLabel = styled.span`
  color: ${theme.colors.textMuted};
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;

  @media (max-width: 480px) {
    display: none;
  }
`;
