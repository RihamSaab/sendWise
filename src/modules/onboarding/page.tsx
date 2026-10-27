"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import styled from "styled-components";

import { completeOnboarding, getOnboardingData } from "@/api/onboarding";

import {
  ONBOARDING_STEP,
  ONBOARDING_STEPS,
  type OnboardingStep,
} from "./config";

import OnboardingLayout from "./components/onboardingLayout";

import StartingPoint, {
  type StartingPointValues,
} from "./components/startingPoint";

import Income, { type IncomeDraft } from "./components/income";

import FixedExpenses, {
  type FixedExpenseDraft,
} from "./components/fixedExpenses";

import Savings, { type FinancialGoalDraft } from "./components/savings";

import Review from "./components/review";

const today = new Date().toLocaleDateString("en-CA");

export default function OnboardingPage() {
  const router = useRouter();

  const onboardingQuery = useQuery({
    queryKey: ["onboarding"],
    queryFn: getOnboardingData,
  });

  const [stepOverride, setStepOverride] = useState<OnboardingStep | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  const savedSettings = onboardingQuery.data?.settings;

  // Users who already completed onboarding go straight to the dashboard.
  useEffect(() => {
    if (savedSettings?.onboarding_completed) {
      router.replace("/dashboard");
    }
  }, [savedSettings?.onboarding_completed, router]);

  const incomeValues: Array<IncomeDraft> = (
    onboardingQuery.data?.incomeSources ?? []
  ).map((income) => ({
    ...income,
    draftId:
      income.id !== undefined ? `income-${income.id}` : crypto.randomUUID(),
  }));

  const expenseValues: Array<FixedExpenseDraft> = (
    onboardingQuery.data?.fixedExpenses ?? []
  ).map((expense) => ({
    ...expense,
    draftId:
      expense.id !== undefined ? `expense-${expense.id}` : crypto.randomUUID(),
  }));

  const goalValues: Array<FinancialGoalDraft> = (
    onboardingQuery.data?.financialGoals ?? []
  ).map((goal) => ({
    ...goal,
    draftId: goal.id !== undefined ? `goal-${goal.id}` : crypto.randomUUID(),
  }));

  const currentStep: OnboardingStep =
    stepOverride ??
    (Math.min(
      Math.max(
        savedSettings?.onboarding_step ?? ONBOARDING_STEP.STARTING_POINT,
        ONBOARDING_STEP.STARTING_POINT,
      ),
      ONBOARDING_STEP.REVIEW,
    ) as OnboardingStep);

  const finishMutation = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: async () => {
      setErrorMessage("");
      await onboardingQuery.refetch();
      router.replace("/dashboard");
    },
    onError: () => {
      setErrorMessage("We couldn't finish your setup. Please try again.");
    },
  });

  function handleBack() {
    setStepOverride(
      Math.max(
        ONBOARDING_STEP.STARTING_POINT,
        currentStep - 1,
      ) as OnboardingStep,
    );

    setErrorMessage("");
  }

  function handleContinue() {
    setErrorMessage("");

    if (currentStep === ONBOARDING_STEP.REVIEW) {
      finishMutation.mutate();
    }
  }

  if (onboardingQuery.isPending) {
    return <LoadingMessage>Loading your financial setup...</LoadingMessage>;
  }

  if (onboardingQuery.isError || !savedSettings || !onboardingQuery.data) {
    return (
      <LoadingMessage>
        We couldn&apos;t load your financial setup. Check that your backend is
        running, then refresh this page.
      </LoadingMessage>
    );
  }

  const isLoading = finishMutation.isPending;

  const startingPointValues: StartingPointValues = {
    currency: savedSettings.currency || "USD",
    starting_balance: String(savedSettings.starting_balance ?? 0),
    tracking_start_date: savedSettings.tracking_start_date || today,
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      onBack={handleBack}
      onContinue={handleContinue}
      isFirstStep={currentStep === ONBOARDING_STEP.STARTING_POINT}
      isLastStep={currentStep === ONBOARDING_STEP.REVIEW}
      isLoading={isLoading}
      canContinue
      formId={ONBOARDING_STEPS[currentStep - 1].formId}
    >
      {currentStep === ONBOARDING_STEP.STARTING_POINT ? (
        <StartingPoint
          defaultValues={startingPointValues}
          onSuccess={() => {
            setErrorMessage("");
            setStepOverride(ONBOARDING_STEP.INCOME);
          }}
        />
      ) : currentStep === ONBOARDING_STEP.INCOME ? (
        <Income
          defaultValues={{
            incomeSources: incomeValues,
          }}
          onSuccess={() => {
            setErrorMessage("");
            setStepOverride(ONBOARDING_STEP.FIXED_EXPENSES);
          }}
        />
      ) : currentStep === ONBOARDING_STEP.FIXED_EXPENSES ? (
        <FixedExpenses
          defaultValues={{
            fixedExpenses: expenseValues,
          }}
          onSuccess={() => {
            setErrorMessage("");
            setStepOverride(ONBOARDING_STEP.SAVINGS);
          }}
        />
      ) : currentStep === ONBOARDING_STEP.SAVINGS ? (
        <Savings
          defaultValues={{
            savings_percentage: String(savedSettings.savings_percentage ?? 0),
            savings_basis: savedSettings.savings_basis ?? "income",
            financialGoals: goalValues,
          }}
          onSuccess={() => {
            setErrorMessage("");
            setStepOverride(ONBOARDING_STEP.REVIEW);
          }}
        />
      ) : (
        <Review
          settings={savedSettings}
          incomeSources={onboardingQuery.data.incomeSources}
          fixedExpenses={onboardingQuery.data.fixedExpenses}
          financialGoals={onboardingQuery.data.financialGoals}
        />
      )}

      {errorMessage ? (
        <ErrorMessage role="alert">{errorMessage}</ErrorMessage>
      ) : null}
    </OnboardingLayout>
  );
}

const LoadingMessage = styled.main`
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
  background: #f7f6f0;
  color: #244b3b;
  text-align: center;
`;

const ErrorMessage = styled.p`
  margin: 20px 0 0;
  color: #b42318;
  font-size: 0.875rem;
  line-height: 1.5;
`;
