import Link from "next/link";
import styled from "styled-components";

import theme from "@/styles/theme";

export default function LandingHeader() {
  return (
    <Header>
      <Navigation aria-label="Main navigation">
        <Brand href="/" aria-label="SpendWise home">
          Spend<span>Wise</span>
          <BrandDot />
        </Brand>

        <NavLinks>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How it works</NavLink>
        </NavLinks>

        <HeaderActions>
          <SignInLink href="/dashboard">Dashboard</SignInLink>

          <HeaderButton href="/onboarding">
            Get started <span aria-hidden="true">↗</span>
          </HeaderButton>
        </HeaderActions>
      </Navigation>
    </Header>
  );
}

const Header = styled.header`
  position: relative;
  z-index: 5;
  border-bottom: 1px solid ${theme.colors.border};
  background: ${theme.colors.background};
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: ${theme.spacing.md} ${theme.spacing["2xl"]};

  @media (max-width: 700px) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${theme.colors.primary};
  font-size: 1.55rem;
  font-weight: 750;
  letter-spacing: -0.075em;
  text-decoration: none;

  span {
    color: ${theme.colors.text};
  }
`;

const BrandDot = styled.span`
  width: 7px;
  height: 7px;
  margin: 0 0 0 4px;
  border-radius: 50%;
  background: ${theme.colors.amber};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xl};

  @media (max-width: 700px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${theme.colors.textSecondary};
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 160ms ease;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const SignInLink = styled(Link)`
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: ${theme.colors.primaryHover};
  }

  @media (max-width: 420px) {
    display: none;
  }
`;

const HeaderButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: 11px 16px;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.primary};
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    background 180ms ease,
    transform 180ms ease;

  &:hover {
    transform: translateY(-1px);
    background: ${theme.colors.primaryHover};
  }

  &:focus-visible {
    outline: 3px solid ${theme.colors.amber};
    outline-offset: 3px;
  }
`;
