"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Settings,
  TrendingUp,
  Receipt,
  Target,
  UserRound,
} from "lucide-react";

import Link from "next/link";
import styled from "styled-components";

const navigationItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Income",
    href: "/dashboard/income",
    icon: TrendingUp,
  },
  {
    label: "Expenses",
    href: "/dashboard/expenses",
    icon: Receipt,
  },
  {
    label: "Goals",
    href: "/dashboard/goals",
    icon: Target,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <StyledSidebar>
      <StyledSidebar_Brand href="/dashboard">
        <StyledSidebar_BrandMark>
          <Wallet size={21} strokeWidth={2} />
        </StyledSidebar_BrandMark>{" "}
        <StyledSidebar_BrandName>SpendWise</StyledSidebar_BrandName>
      </StyledSidebar_Brand>

      <StyledSidebar_Navigation aria-label="Main navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <StyledSidebar_NavLink
              key={item.href}
              href={item.href}
              $active={isActive}
              aria-current={isActive ? "page" : undefined}
            >
              <StyledSidebar_NavIcon $active={isActive}>
                <Icon size={18} strokeWidth={1.8} />
              </StyledSidebar_NavIcon>

              <StyledSidebar_NavLabel>{item.label}</StyledSidebar_NavLabel>
            </StyledSidebar_NavLink>
          );
        })}
      </StyledSidebar_Navigation>

      <StyledSidebar_Bottom>
        <StyledSidebar_Profile>
          <StyledSidebar_Avatar>
            <UserRound size={19} strokeWidth={1.8} />
          </StyledSidebar_Avatar>

          <StyledSidebar_ProfileInfo>
            <StyledSidebar_ProfileName>My Account</StyledSidebar_ProfileName>

            <StyledSidebar_ProfileDescription>
              Personal workspace
            </StyledSidebar_ProfileDescription>
          </StyledSidebar_ProfileInfo>
        </StyledSidebar_Profile>
      </StyledSidebar_Bottom>
    </StyledSidebar>
  );
}

const StyledSidebar = styled.aside`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  min-width: 250px;
  height: 100vh;
  padding: 28px 18px 20px;
  flex-shrink: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);

  @media (max-width: 640px) {
    position: static;
    width: 100%;
    height: auto;
    padding: 16px;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
`;

const StyledSidebar_Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 4px 10px;
  margin-bottom: 44px;

  @media (max-width: 640px) {
    margin-bottom: 20px;
  }
`;

const StyledSidebar_BrandMark = styled.span`
  display: grid;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: var(--color-primary);
  color: #fff;
`;

const StyledSidebar_BrandName = styled.span`
  color: var(--color-text);
  font-size: 18px;
  font-weight: 650;
  letter-spacing: -0.045em;
`;

const StyledSidebar_Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 5px;

  @media (max-width: 640px) {
    flex-direction: row;
    gap: 4px;
    overflow-x: auto;
  }
`;

const StyledSidebar_NavLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 11px;
  background: ${({ $active }) =>
    $active ? "var(--color-sage)" : "transparent"};
  color: ${({ $active }) =>
    $active ? "var(--color-primary)" : "var(--color-text-secondary)"};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  transition:
    background 180ms ease,
    color 180ms ease;
  white-space: nowrap;

  &:hover {
    background: var(--color-sage);
    color: var(--color-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    gap: 8px;
    padding: 0 10px;
  }
`;

const StyledSidebar_NavIcon = styled.span<{
  $active: boolean;
}>`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: ${({ $active }) =>
    $active ? "var(--color-primary)" : "var(--color-text-secondary)"};
`;

const StyledSidebar_NavLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledSidebar_Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: auto;
  padding-top: 24px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const StyledSidebar_Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 16px 8px 4px;
  border-top: 1px solid var(--color-border);
`;

const StyledSidebar_Avatar = styled.div`
  display: grid;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-background);
  color: var(--color-primary);
`;

const StyledSidebar_ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

const StyledSidebar_ProfileName = styled.span`
  color: var(--color-text);
  font-size: 13px;
  font-weight: 600;
`;

const StyledSidebar_ProfileDescription = styled.span`
  color: var(--color-text-secondary);
  font-size: 11px;
`;
