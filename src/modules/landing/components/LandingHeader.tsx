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
            Get started <span aria-hidden="true">→</span>
          </HeaderButton>
        </HeaderActions>
      </Navigation>
    </Header>
  );
}

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgb(247 246 240 / 85%);
  backdrop-filter: saturate(160%) blur(16px);
  -webkit-backdrop-filter: saturate(160%) blur(16px);
  box-shadow: 0 1px 0 rgb(0 0 0 / 4%);
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px ${theme.spacing["2xl"]};

  @media (max-width: 700px) {
    padding: 18px ${theme.spacing.lg};
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${theme.colors.primary};
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.055em;
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
  font-weight: 500;
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
  padding: 10px 20px;
  border: none;
  border-radius: ${theme.radius.pill};
  background: ${theme.gradient.primary};
  box-shadow:
    ${theme.specular.topDark},
    ${theme.elevation.low};
  color: ${theme.colors.textOnPrimary};
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    background ${theme.duration.base} ${theme.ease.silk},
    transform ${theme.duration.base} ${theme.ease.silk},
    box-shadow ${theme.duration.base} ${theme.ease.silk};

  &:hover {
    transform: translateY(-1px);
    background: ${theme.gradient.primaryHover};
    box-shadow:
      ${theme.specular.topDark},
      ${theme.elevation.medium};
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      ${theme.specular.topDark},
      ${theme.elevation.medium},
      0 0 0 3px rgb(196 138 74 / 35%);
  }
`;
