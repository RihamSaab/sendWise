"use client";

import { useState } from "react";
import styled from "styled-components";

import { useCurrentUser } from "@/api/useAuth";

const DISMISS_KEY = "spendwise:unsavedBanner:dismissed";

function wasDismissedThisSession(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(DISMISS_KEY) === "1";
}

export default function UnsavedPlanBanner() {
  const [dismissed, setDismissed] = useState<boolean>(() =>
    wasDismissedThisSession(),
  );

  const { data: user } = useCurrentUser();

  if (dismissed) return null;
  if (user) return null;

  function handleDismiss() {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    }
    setDismissed(true);
  }

  return (
    <Banner role="status" aria-live="polite">
      <Content>
        <IconDot aria-hidden="true" />
        <Text>
          <strong>Your plan is saved on this device only.</strong>{" "}
          Sign in to save it and access it from anywhere.
        </Text>
      </Content>

      <Actions>
        <SignInLink href="/signup">Sign in to save</SignInLink>
        <DismissButton
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
        >
          ×
        </DismissButton>
      </Actions>
    </Banner>
  );
}

const Banner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: 10px var(--spacing-lg);
  background: var(--gradient-surface-muted);
  box-shadow: 0 1px 0 var(--color-border);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px var(--spacing-md);
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 0;
`;

const IconDot = styled.span`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-amber);
  box-shadow: 0 0 0 4px var(--color-amber-soft);
`;

const Text = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.5;

  strong {
    color: var(--color-text);
    font-weight: 600;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
`;

const SignInLink = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: var(--gradient-primary);
  box-shadow: var(--specular-top-dark), var(--elevation-1);
  color: var(--color-text-on-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  transition:
    transform var(--dur-base) var(--ease-silk),
    box-shadow var(--dur-base) var(--ease-silk);

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--specular-top-dark), var(--elevation-2);
  }
`;

const DismissButton = styled.button`
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease-silk);

  &:hover {
    background: var(--color-border-soft);
    color: var(--color-text);
  }
`;
