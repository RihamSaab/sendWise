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
  padding: 0 24px 48px;
  background: #f7f6f0;
  color: #273b31;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
  padding: 26px 0;
  border-bottom: 1px solid #e5e6df;
`;

const Brand = styled.div`
  color: #244b3b;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.06em;

  span {
    color: #819783;
  }
`;

const HeaderLabel = styled.span`
  color: #778078;
  font-size: 0.85rem;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const Main = styled.main`
  width: 100%;
  max-width: 760px;
  margin: 48px auto 0;
`;

const ProgressSection = styled.section`
  margin-bottom: 36px;
`;

const ProgressHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
`;

const ProgressTitle = styled.h2`
  margin: 0;
  color: #244b3b;
  font-size: 1.05rem;
  font-weight: 600;
`;

const ProgressCount = styled.span`
  color: #778078;
  font-size: 0.8rem;
  white-space: nowrap;
`;

const ProgressTrack = styled.div`
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: #e3e7df;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  border-radius: inherit;
  background: #244b3b;
  transition: width 200ms ease;
`;

const StepList = styled.ol`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;

  @media (max-width: 560px) {
    gap: 4px;
  }
`;

const StepItem = styled.li<{ $isCurrent: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  opacity: ${({ $isCurrent }) => ($isCurrent ? 1 : 0.75)};
`;

const StepNumber = styled.span<{
  $isComplete: boolean;
  $isCurrent: boolean;
}>`
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid
    ${({ $isComplete, $isCurrent }) =>
      $isComplete || $isCurrent ? "#244b3b" : "#d8ddd5"};
  border-radius: 50%;
  background: ${({ $isComplete, $isCurrent }) =>
    $isComplete || $isCurrent ? "#244b3b" : "transparent"};
  color: ${({ $isComplete, $isCurrent }) =>
    $isComplete || $isCurrent ? "#ffffff" : "#778078"};
  font-size: 0.8rem;
  font-weight: 600;
`;

const StepLabel = styled.span<{ $isCurrent: boolean }>`
  color: ${({ $isCurrent }) => ($isCurrent ? "#244b3b" : "#778078")};
  font-size: 0.75rem;
  font-weight: ${({ $isCurrent }) => ($isCurrent ? 600 : 400)};

  @media (max-width: 560px) {
    font-size: 0.65rem;
  }
`;

const Content = styled.div`
  padding: 32px;
  border: 1px solid #e7e8e0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 8px 30px rgb(39 59 49 / 4%);

  @media (max-width: 560px) {
    padding: 22px 18px;
  }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
`;

const Button = styled.button`
  min-height: 46px;
  padding: 0 24px;
  border-radius: 10px;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 150ms ease,
    border-color 150ms ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  &:focus-visible {
    outline: 3px solid rgb(36 75 59 / 25%);
    outline-offset: 2px;
  }
`;

const BackButton = styled(Button)`
  border: 1px solid #dce2dc;
  background: #ffffff;
  color: #244b3b;

  &:hover:not(:disabled) {
    background: #f3f5f0;
  }
`;

const ContinueButton = styled(Button)`
  border: 1px solid #244b3b;
  background: #244b3b;
  color: #ffffff;

  &:hover:not(:disabled) {
    background: #193a2d;
  }
`;

const FooterNote = styled.p`
  margin: 22px 0 0;
  color: #858d86;
  font-size: 0.75rem;
  text-align: center;
`;
