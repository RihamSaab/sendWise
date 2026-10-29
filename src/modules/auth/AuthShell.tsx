"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import styled from "styled-components";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <Page>
      <TopBar>
        <Brand href="/" aria-label="SpendWise home">
          Spend<span>Wise</span>
          <BrandDot />
        </Brand>
      </TopBar>

      <Main>
        <Panel>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Title>{title}</Title>
          <Description>{description}</Description>
          {children}
          <Footer>{footer}</Footer>
        </Panel>
      </Main>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 var(--spacing-lg);
  background: var(--color-background);
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-lg) 0;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: var(--color-primary);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  text-decoration: none;

  span {
    color: var(--color-text);
  }
`;

const BrandDot = styled.span`
  width: 7px;
  height: 7px;
  margin: 0 0 0 4px;
  border-radius: 50%;
  background: var(--color-amber);
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  padding: var(--spacing-2xl) 0 var(--spacing-3xl);
`;

const Panel = styled.section`
  width: 100%;
  max-width: 440px;
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  background: var(--gradient-surface);
  box-shadow: var(--specular-top), var(--elevation-3);

  @media (max-width: 480px) {
    padding: var(--spacing-lg);
  }
`;

const Eyebrow = styled.p`
  margin: 0 0 var(--spacing-sm);
  color: var(--color-primary);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  color: var(--color-text);
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.03em;
`;

const Description = styled.p`
  margin: 10px 0 var(--spacing-lg);
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  line-height: 1.6;
`;

const Footer = styled.div`
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-soft);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  text-align: center;

  a {
    color: var(--color-primary);
    font-weight: 600;
  }
`;
