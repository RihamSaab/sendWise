import {
  localStore,
  type LocalFinancialGoal,
  type LocalFixedExpense,
  type LocalIncomeSource,
  type LocalSettings,
} from "./localStore";

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

function toOnboardingSettings(settings: LocalSettings): OnboardingSettings {
  return {
    id: settings.id,
    currency: settings.currency,
    starting_balance: settings.starting_balance,
    tracking_start_date: settings.tracking_start_date,
    savings_percentage: settings.savings_percentage,
    savings_basis: settings.savings_basis,
    onboarding_step: settings.onboarding_step,
    onboarding_completed: settings.onboarding_completed,
  };
}

function fromLocalIncome(row: LocalIncomeSource): IncomeSource {
  return {
    id: row.id,
    name: row.name,
    amount: row.amount,
    frequency: row.frequency,
    start_date: row.start_date,
    end_date: row.end_date,
    notes: row.notes,
    is_active: row.is_active,
  };
}

function fromLocalExpense(row: LocalFixedExpense): FixedExpense {
  return {
    id: row.id,
    name: row.name,
    amount: row.amount,
    frequency: row.frequency,
    start_date: row.start_date,
    end_date: row.end_date,
    notes: row.notes,
    is_active: row.is_active,
  };
}

function fromLocalGoal(row: LocalFinancialGoal): FinancialGoal {
  return {
    id: row.id,
    name: row.name,
    target_amount: row.target_amount,
    current_amount: row.current_amount,
    target_date: row.target_date,
    notes: row.notes,
    is_active: row.is_active,
  };
}

export async function getOnboardingData(): Promise<OnboardingData> {
  return {
    settings: toOnboardingSettings(localStore.getSettings()),
    incomeSources: localStore.getIncomeSources().map(fromLocalIncome),
    fixedExpenses: localStore.getFixedExpenses().map(fromLocalExpense),
    financialGoals: localStore.getFinancialGoals().map(fromLocalGoal),
  };
}

export async function saveStartingPoint(
  input: StartingPointInput,
): Promise<OnboardingSettings> {
  const next = localStore.patchSettings({
    currency: input.currency,
    starting_balance: input.starting_balance,
    tracking_start_date: input.tracking_start_date,
    onboarding_step: Math.max(2, localStore.getSettings().onboarding_step),
  });
  return toOnboardingSettings(next);
}

function reconcileList<
  T extends { id?: number; is_active: boolean },
  L extends { id: number },
>(
  incoming: Array<T>,
  existing: Array<L>,
  buildNew: (item: T) => Omit<L, "id">,
  mergeExisting: (existing: L, item: T) => L,
): Array<L> {
  const incomingIds = new Set<number>();
  const updated: Array<L> = [];

  incoming.forEach((item) => {
    if (item.id !== undefined) {
      incomingIds.add(item.id);
      const existingRow = existing.find((row) => row.id === item.id);
      if (existingRow) {
        updated.push(mergeExisting(existingRow, item));
      }
    } else {
      const row = { ...buildNew(item), id: nextIdSync() } as L;
      updated.push(row);
    }
  });

  existing.forEach((row) => {
    if (!incomingIds.has(row.id) && !updated.some((item) => item.id === row.id)) {
      updated.push({ ...row, is_active: false } as L);
    }
  });

  return updated;
}

let localIdCounter = Date.now();
function nextIdSync(): number {
  localIdCounter += 1;
  return localIdCounter;
}

export async function saveIncomeSources(
  input: SaveIncomeInput,
): Promise<unknown> {
  const existing = localStore.getIncomeSources();
  const next = reconcileList<IncomeSource, LocalIncomeSource>(
    input.incomeSources,
    existing,
    (item) => ({
      name: item.name,
      amount: item.amount,
      frequency: item.frequency,
      start_date: item.start_date,
      end_date: item.end_date,
      notes: item.notes,
      is_active: item.is_active,
    }),
    (row, item) => ({
      ...row,
      name: item.name,
      amount: item.amount,
      frequency: item.frequency,
      start_date: item.start_date,
      end_date: item.end_date,
      notes: item.notes,
      is_active: item.is_active,
    }),
  );

  localStore.setIncomeSources(next);
  localStore.patchSettings({
    onboarding_step: Math.max(3, localStore.getSettings().onboarding_step),
  });
  return { ok: true };
}

export async function saveFixedExpenses(
  input: SaveFixedExpensesInput,
): Promise<unknown> {
  const existing = localStore.getFixedExpenses();
  const next = reconcileList<FixedExpense, LocalFixedExpense>(
    input.fixedExpenses,
    existing,
    (item) => ({
      name: item.name,
      amount: item.amount,
      frequency: item.frequency,
      start_date: item.start_date,
      end_date: item.end_date,
      notes: item.notes,
      is_active: item.is_active,
    }),
    (row, item) => ({
      ...row,
      name: item.name,
      amount: item.amount,
      frequency: item.frequency,
      start_date: item.start_date,
      end_date: item.end_date,
      notes: item.notes,
      is_active: item.is_active,
    }),
  );

  localStore.setFixedExpenses(next);
  localStore.patchSettings({
    onboarding_step: Math.max(4, localStore.getSettings().onboarding_step),
  });
  return { ok: true };
}

export async function saveSavings(input: SaveSavingsInput): Promise<unknown> {
  const existing = localStore.getFinancialGoals();
  const next = reconcileList<FinancialGoal, LocalFinancialGoal>(
    input.financialGoals,
    existing,
    (item) => ({
      name: item.name,
      target_amount: item.target_amount,
      current_amount: item.current_amount,
      target_date: item.target_date,
      notes: item.notes,
      is_active: item.is_active,
    }),
    (row, item) => ({
      ...row,
      name: item.name,
      target_amount: item.target_amount,
      current_amount: item.current_amount,
      target_date: item.target_date,
      notes: item.notes,
      is_active: item.is_active,
    }),
  );

  localStore.setFinancialGoals(next);
  localStore.patchSettings({
    savings_percentage: input.savings_percentage,
    savings_basis: input.savings_basis,
    onboarding_step: Math.max(5, localStore.getSettings().onboarding_step),
  });
  return { ok: true };
}

export async function completeOnboarding(): Promise<{
  onboarding_step: number;
  onboarding_completed: boolean;
}> {
  const next = localStore.patchSettings({
    onboarding_step: 5,
    onboarding_completed: true,
  });
  return {
    onboarding_step: next.onboarding_step,
    onboarding_completed: next.onboarding_completed,
  };
}
