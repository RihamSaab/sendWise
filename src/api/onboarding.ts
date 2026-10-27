import { apiClient } from "./client";

// Types

export type IncomeFrequency = "weekly" | "monthly" | "yearly" | "one_time";

export type CurrencyCode = "USD" | "LBP" | "EUR";

export type StartingPointInput = {
  currency: string;
  starting_balance: number;
  tracking_start_date: string;
};

export type IncomeSource = {
  id?: number;
  name: string;
  amount: number;
  frequency: IncomeFrequency;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
};

export type FixedExpense = {
  id?: number;
  name: string;
  amount: number;
  frequency: IncomeFrequency;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
};

export type FinancialGoal = {
  id?: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  notes: string | null;
  is_active: boolean;
};

export type SavingsBasis = "income" | "current_savings";

export type OnboardingSettings = {
  id: number;
  currency: string;
  starting_balance: string | number;
  tracking_start_date: string;
  savings_percentage: string | number;
  savings_basis: SavingsBasis;
  onboarding_step: number;
  onboarding_completed: boolean;
};

export type OnboardingData = {
  settings: OnboardingSettings;
  incomeSources: Array<IncomeSource>;
  fixedExpenses: Array<FixedExpense>;
  financialGoals: Array<FinancialGoal>;
};

export type SaveIncomeInput = {
  incomeSources: Array<IncomeSource>;
};

export type SaveFixedExpensesInput = {
  fixedExpenses: Array<FixedExpense>;
};

export type SaveSavingsInput = {
  savings_percentage: number;
  savings_basis: SavingsBasis;
  financialGoals: Array<FinancialGoal>;
};

// Read saved onboarding data

export async function getOnboardingData(): Promise<OnboardingData> {
  const response = await apiClient.get<OnboardingData>(
    "/settings/onboarding",
  );

  return response.data;
}

// Step 1: Starting point

export async function saveStartingPoint(
  input: StartingPointInput,
): Promise<OnboardingSettings> {
  const response = await apiClient.put<OnboardingSettings>(
    "/settings/onboarding/starting-point",
    input,
  );

  return response.data;
}

// Step 2: Income sources

export async function saveIncomeSources(
  input: SaveIncomeInput,
): Promise<unknown> {
  const response = await apiClient.put(
    "/settings/onboarding/income",
    input,
  );

  return response.data;
}

// Step 3: Fixed expenses

export async function saveFixedExpenses(
  input: SaveFixedExpensesInput,
): Promise<unknown> {
  const response = await apiClient.put(
    "/settings/onboarding/fixed-expenses",
    input,
  );

  return response.data;
}

// Step 4: Savings and goals

export async function saveSavings(input: SaveSavingsInput): Promise<unknown> {
  const response = await apiClient.put(
    "/settings/onboarding/savings",
    input,
  );

  return response.data;
}

// Step 5: Finish onboarding

export async function completeOnboarding(): Promise<{
  onboarding_step: number;
  onboarding_completed: boolean;
}> {
  const response = await apiClient.put<{
    onboarding_step: number;
    onboarding_completed: boolean;
  }>("/settings/onboarding/complete");

  return response.data;
}
