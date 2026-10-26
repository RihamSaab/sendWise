export const ONBOARDING_STEP = {
  STARTING_POINT: 1,
  INCOME: 2,
  FIXED_EXPENSES: 3,
  SAVINGS: 4,
  REVIEW: 5,
} as const;

export type OnboardingStep =
  (typeof ONBOARDING_STEP)[keyof typeof ONBOARDING_STEP];

export const ONBOARDING_STEPS = [
  {
    number: ONBOARDING_STEP.STARTING_POINT,
    label: "Starting point",
    formId: "starting-point-form",
  },
  {
    number: ONBOARDING_STEP.INCOME,
    label: "Income",
    formId: "income-form",
  },
  {
    number: ONBOARDING_STEP.FIXED_EXPENSES,
    label: "Fixed expenses",
    formId: "fixed-expenses-form",
  },
  {
    number: ONBOARDING_STEP.SAVINGS,
    label: "Savings",
    formId: "savings-form",
  },
  {
    number: ONBOARDING_STEP.REVIEW,
    label: "Review",
    formId: undefined,
  },
] as const;

export const TOTAL_ONBOARDING_STEPS = ONBOARDING_STEPS.length;
