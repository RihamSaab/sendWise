const SCHEMA_VERSION = 1;
const KEY_PREFIX = "spendwise";

type EntityKey =
  | "settings"
  | "categories"
  | "transactions"
  | "incomeSources"
  | "fixedExpenses"
  | "financialGoals"
  | "nextId";

function keyFor(entity: EntityKey): string {
  return `${KEY_PREFIX}:v${SCHEMA_VERSION}:${entity}`;
}

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read<T>(entity: EntityKey, fallback: T): T {
  if (!hasStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(keyFor(entity));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(entity: EntityKey, value: T): void {
  if (!hasStorage()) return;
  window.localStorage.setItem(keyFor(entity), JSON.stringify(value));
}

export type LocalCategory = {
  id: number;
  name: string;
  type: "income" | "expense" | "both";
};

const DEFAULT_CATEGORIES: Array<LocalCategory> = [
  { id: 1, name: "Salary", type: "income" },
  { id: 2, name: "Freelance", type: "income" },
  { id: 3, name: "Investments", type: "income" },
  { id: 4, name: "Other income", type: "income" },
  { id: 5, name: "Groceries", type: "expense" },
  { id: 6, name: "Rent / Mortgage", type: "expense" },
  { id: 7, name: "Utilities", type: "expense" },
  { id: 8, name: "Transport", type: "expense" },
  { id: 9, name: "Dining out", type: "expense" },
  { id: 10, name: "Shopping", type: "expense" },
  { id: 11, name: "Entertainment", type: "expense" },
  { id: 12, name: "Healthcare", type: "expense" },
  { id: 13, name: "Subscriptions", type: "expense" },
  { id: 14, name: "Other expense", type: "expense" },
  { id: 15, name: "Transfer", type: "both" },
];

export type LocalSettings = {
  id: number;
  currency: string;
  starting_balance: number;
  tracking_start_date: string;
  savings_percentage: number;
  savings_basis: "income" | "current_savings";
  onboarding_step: number;
  onboarding_completed: boolean;
};

function todayISO(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const DEFAULT_SETTINGS: LocalSettings = {
  id: 1,
  currency: "USD",
  starting_balance: 0,
  tracking_start_date: todayISO(),
  savings_percentage: 0,
  savings_basis: "income",
  onboarding_step: 1,
  onboarding_completed: false,
};

export type LocalTransaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category_id: number;
  transaction_date: string;
  notes: string | null;
  created_at: string;
};

export type LocalIncomeSource = {
  id: number;
  name: string;
  amount: number;
  frequency: "weekly" | "monthly" | "yearly" | "one_time";
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
};

export type LocalFixedExpense = {
  id: number;
  name: string;
  amount: number;
  frequency: "weekly" | "monthly" | "yearly" | "one_time";
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
};

export type LocalFinancialGoal = {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  notes: string | null;
  is_active: boolean;
};

let nextIdCounter: number | null = null;

function nextId(): number {
  if (nextIdCounter === null) {
    nextIdCounter = read<number>("nextId", 1000);
  }
  nextIdCounter += 1;
  write("nextId", nextIdCounter);
  return nextIdCounter;
}

export const localStore = {
  getSettings(): LocalSettings {
    return read<LocalSettings>("settings", DEFAULT_SETTINGS);
  },

  setSettings(settings: LocalSettings): LocalSettings {
    write("settings", settings);
    return settings;
  },

  patchSettings(patch: Partial<LocalSettings>): LocalSettings {
    const next = { ...localStore.getSettings(), ...patch };
    write("settings", next);
    return next;
  },

  getCategories(): Array<LocalCategory> {
    return read<Array<LocalCategory>>("categories", DEFAULT_CATEGORIES);
  },

  getTransactions(): Array<LocalTransaction> {
    return read<Array<LocalTransaction>>("transactions", []);
  },

  setTransactions(list: Array<LocalTransaction>): void {
    write("transactions", list);
  },

  addTransaction(input: Omit<LocalTransaction, "id" | "created_at">): LocalTransaction {
    const now = new Date().toISOString();
    const row: LocalTransaction = { id: nextId(), created_at: now, ...input };
    const list = localStore.getTransactions();
    list.push(row);
    localStore.setTransactions(list);
    return row;
  },

  updateTransaction(
    id: number,
    input: Omit<LocalTransaction, "id" | "created_at">,
  ): LocalTransaction {
    const list = localStore.getTransactions();
    const index = list.findIndex((row) => row.id === id);
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    const next: LocalTransaction = {
      ...list[index],
      ...input,
    };
    list[index] = next;
    localStore.setTransactions(list);
    return next;
  },

  deleteTransaction(id: number): void {
    const list = localStore.getTransactions().filter((row) => row.id !== id);
    localStore.setTransactions(list);
  },

  getIncomeSources(): Array<LocalIncomeSource> {
    return read<Array<LocalIncomeSource>>("incomeSources", []);
  },

  setIncomeSources(list: Array<LocalIncomeSource>): void {
    write("incomeSources", list);
  },

  addIncomeSource(
    input: Omit<LocalIncomeSource, "id">,
  ): LocalIncomeSource {
    const row: LocalIncomeSource = { id: nextId(), ...input };
    const list = localStore.getIncomeSources();
    list.push(row);
    localStore.setIncomeSources(list);
    return row;
  },

  updateIncomeSource(
    id: number,
    input: Omit<LocalIncomeSource, "id">,
  ): LocalIncomeSource {
    const list = localStore.getIncomeSources();
    const index = list.findIndex((row) => row.id === id);
    if (index === -1) throw new Error("Income source not found");
    const next: LocalIncomeSource = { ...list[index], ...input };
    list[index] = next;
    localStore.setIncomeSources(list);
    return next;
  },

  deleteIncomeSource(id: number): void {
    const list = localStore.getIncomeSources().filter((row) => row.id !== id);
    localStore.setIncomeSources(list);
  },

  getFixedExpenses(): Array<LocalFixedExpense> {
    return read<Array<LocalFixedExpense>>("fixedExpenses", []);
  },

  setFixedExpenses(list: Array<LocalFixedExpense>): void {
    write("fixedExpenses", list);
  },

  addFixedExpense(input: Omit<LocalFixedExpense, "id">): LocalFixedExpense {
    const row: LocalFixedExpense = { id: nextId(), ...input };
    const list = localStore.getFixedExpenses();
    list.push(row);
    localStore.setFixedExpenses(list);
    return row;
  },

  updateFixedExpense(
    id: number,
    input: Omit<LocalFixedExpense, "id">,
  ): LocalFixedExpense {
    const list = localStore.getFixedExpenses();
    const index = list.findIndex((row) => row.id === id);
    if (index === -1) throw new Error("Fixed expense not found");
    const next: LocalFixedExpense = { ...list[index], ...input };
    list[index] = next;
    localStore.setFixedExpenses(list);
    return next;
  },

  deleteFixedExpense(id: number): void {
    const list = localStore.getFixedExpenses().filter((row) => row.id !== id);
    localStore.setFixedExpenses(list);
  },

  getFinancialGoals(): Array<LocalFinancialGoal> {
    return read<Array<LocalFinancialGoal>>("financialGoals", []);
  },

  setFinancialGoals(list: Array<LocalFinancialGoal>): void {
    write("financialGoals", list);
  },

  addFinancialGoal(input: Omit<LocalFinancialGoal, "id">): LocalFinancialGoal {
    const row: LocalFinancialGoal = { id: nextId(), ...input };
    const list = localStore.getFinancialGoals();
    list.push(row);
    localStore.setFinancialGoals(list);
    return row;
  },

  updateFinancialGoal(
    id: number,
    input: Omit<LocalFinancialGoal, "id">,
  ): LocalFinancialGoal {
    const list = localStore.getFinancialGoals();
    const index = list.findIndex((row) => row.id === id);
    if (index === -1) throw new Error("Goal not found");
    const next: LocalFinancialGoal = { ...list[index], ...input };
    list[index] = next;
    localStore.setFinancialGoals(list);
    return next;
  },

  deleteFinancialGoal(id: number): void {
    const list = localStore.getFinancialGoals().filter((row) => row.id !== id);
    localStore.setFinancialGoals(list);
  },

  hasAnyData(): boolean {
    if (!hasStorage()) return false;
    const settings = localStore.getSettings();
    return (
      settings.onboarding_completed ||
      localStore.getTransactions().length > 0 ||
      localStore.getIncomeSources().length > 0 ||
      localStore.getFixedExpenses().length > 0 ||
      localStore.getFinancialGoals().length > 0
    );
  },

  reset(): void {
    if (!hasStorage()) return;
    const prefix = `${KEY_PREFIX}:v${SCHEMA_VERSION}:`;
    const keysToRemove: Array<string> = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => window.localStorage.removeItem(key));
    nextIdCounter = null;
  },
};
