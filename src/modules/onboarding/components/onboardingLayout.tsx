"use client";

import styled from "styled-components";
import type { ReactNode } from "react";

import {
  ONBOARDING_STEPS,
  TOTAL_ONBOARDING_STEPS,
  type OnboardingStep,
} from "../config";

export type { OnboardingStep } from "../config";

type OnboardingLayoutProps = {
  currentStep: OnboardingStep;
  onBack: () => void;
  onContinue: () => void;
  children: ReactNode;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
  canContinue?: boolean;
  formId?: string;
};

export default function OnboardingLayout({
  currentStep,
  onBack,
  onContinue,
  children,
  isFirstStep = false,
  isLastStep = false,
  isLoading = false,
  canContinue = true,
  formId,
}: OnboardingLayoutProps) {
  return (
    <Page>
      <Header>
        <Brand>
          Spend<span>Wise</span>
        </Brand>
        <HeaderLabel>Personal finance setup</HeaderLabel>
      </Header>

      <Main>
        <ProgressSection>
          <ProgressHeading>
            <ProgressTitle>Set up your finances</ProgressTitle>
            <ProgressCount>
              Step {currentStep} of {TOTAL_ONBOARDING_STEPS}
            </ProgressCount>
          </ProgressHeading>

          <ProgressTrack
            role="progressbar"
            aria-label="Onboarding progress"
            aria-valuemin={1}
            aria-valuemax={TOTAL_ONBOARDING_STEPS}
            aria-valuenow={currentStep}
          >
            <ProgressFill
              $progress={(currentStep / TOTAL_ONBOARDING_STEPS) * 100}
            />
          </ProgressTrack>

          <StepList>
            {ONBOARDING_STEPS.map((step) => {
              const isComplete = step.number < currentStep;
              const isCurrent = step.number === currentStep;

              return (
                <StepItem key={step.number} $isCurrent={isCurrent}>
                  <StepNumber $isComplete={isComplete} $isCurrent={isCurrent}>
                    {isComplete ? "✓" : step.number}
                  </StepNumber>

                  <StepLabel $isCurrent={isCurrent}>{step.label}</StepLabel>
                </StepItem>
              );
            })}
          </StepList>
        </ProgressSection>

        <Content>{children}</Content>

        <Footer>
          <BackButton
            type="button"
            onClick={onBack}
            disabled={isFirstStep || isLoading}
          >
            Back
          </BackButton>

          <ContinueButton
            type={formId ? "submit" : "button"}
            form={formId}
            onClick={formId ? undefined : onContinue}
            disabled={!canContinue || isLoading}
          >
            {isLoading ? "Saving..." : isLastStep ? "Finish setup" : "Continue"}
          </ContinueButton>
        </Footer>

        <FooterNote>
          Your financial information stays in your SpendWise account.
        </FooterNote>
      </Main>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  padding: 0 var(--spacing-lg) var(--spacing-2xl);
  background: var(--color-background);
  color: var(--color-text);
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--spacing-lg) 0;
  border-bottom: var(--stroke) solid var(--color-border);
`;

const Brand = styled.div`
  color: var(--color-primary);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.05em;

  span {
    color: var(--color-text);
  }
`;

const HeaderLabel = styled.span`
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const Main = styled.main`
  width: 100%;
  max-width: 760px;
  margin: var(--spacing-2xl) auto 0;
`;

const ProgressSection = styled.section`
  margin-bottom: var(--spacing-xl);
`;

const ProgressHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const ProgressTitle = styled.h2`
  margin: 0;
  color: var(--color-primary);
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const ProgressCount = styled.span`
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.04em;
  white-space: nowrap;
`;

const ProgressTrack = styled.div`
  height: 4px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-border);
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
  transition: width 250ms ease;
`;

const StepList = styled.ol`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--spacing-sm);
  margin: var(--spacing-lg) 0 0;
  padding: 0;
  list-style: none;

  @media (max-width: 560px) {
    gap: var(--spacing-xs);
  }
`;

const StepItem = styled.li<{ $isCurrent: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  text-align: center;
  opacity: ${({ $isCurrent }) => ($isCurrent ? 1 : 0.7)};
`;

const StepNumber = styled.span<{
  $isComplete: boolean;
  $isCurrent: boolean;
}>`
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: var(--stroke) solid
    ${({ $isComplete, $isCurrent }) =>
      $isComplete || $isCurrent
        ? "var(--color-primary)"
        : "var(--color-border-strong)"};
  border-radius: 50%;
  background: ${({ $isComplete, $isCurrent }) =>
    $isComplete || $isCurrent ? "var(--color-primary)" : "transparent"};
  color: ${({ $isComplete, $isCurrent }) =>
    $isComplete || $isCurrent
      ? "var(--color-text-on-primary)"
      : "var(--color-text-muted)"};
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
`;

const StepLabel = styled.span<{ $isCurrent: boolean }>`
  color: ${({ $isCurrent }) =>
    $isCurrent ? "var(--color-primary)" : "var(--color-text-muted)"};
  font-size: var(--text-xs);
  font-weight: ${({ $isCurrent }) => ($isCurrent ? 600 : 400)};

  @media (max-width: 560px) {
    font-size: 10px;
  }
`;

const Content = styled.div`
  padding: var(--spacing-xl);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  box-shadow: var(--elevation-2);

  @media (max-width: 560px) {
    padding: var(--spacing-lg) var(--spacing-md);
  }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`;

const Button = styled.button`
  min-height: 44px;
  padding: 0 var(--spacing-lg);
  border-radius: var(--radius-md);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 150ms ease,
    border-color 150ms ease,
    transform 150ms ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  &:focus-visible {
    outline: 2px solid var(--color-amber);
    outline-offset: 2px;
  }
`;

const BackButton = styled(Button)`
  border: var(--stroke) solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-primary);

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
  }
`;

const ContinueButton = styled(Button)`
  border: var(--stroke) solid var(--color-primary);
  background: var(--color-primary);
  color: var(--color-text-on-primary);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: var(--color-primary-hover);
    box-shadow: var(--elevation-2);
  }
`;

const FooterNote = styled.p`
  margin: var(--spacing-lg) 0 0;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  text-align: center;
`;
