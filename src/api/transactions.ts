import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  localStore,
  type LocalTransaction,
  type LocalCategory,
  type LocalFixedExpense,
  type LocalIncomeSource,
} from "./localStore";

type Frequency = "weekly" | "monthly" | "yearly" | "one_time";

function monthlyFactor(frequency: Frequency): number {
  switch (frequency) {
    case "weekly":
      return 52 / 12;
    case "monthly":
      return 1;
    case "yearly":
      return 1 / 12;
    case "one_time":
      return 0;
    default:
      return 1;
  }
}

function monthlyAmount<
  T extends { amount: number; frequency: Frequency; is_active: boolean },
>(row: T): number {
  if (!row.is_active) return 0;
  return Number(row.amount) * monthlyFactor(row.frequency);
}

function isActiveInMonth(
  row: { start_date: string; end_date: string | null; is_active: boolean },
  monthStart: Date,
  monthEnd: Date,
): boolean {
  if (!row.is_active) return false;
  const start = new Date(row.start_date);
  if (!Number.isNaN(start.getTime()) && start > monthEnd) return false;
  if (row.end_date) {
    const end = new Date(row.end_date);
    if (!Number.isNaN(end.getTime()) && end < monthStart) return false;
  }
  return true;
}

export type TransactionType = "income" | "expense";

export type ApiTransaction = {
  id: number;
  title: string;
  amount: string;
  type: TransactionType;
  category_id: number;
  category_name: string;
  transaction_date: string;
  notes: string | null;
  created_at: string;
};

export type ApiCategory = {
  id: number;
  name: string;
  type?: TransactionType | "both";
};

export type TransactionFilters = {
  search?: string;
  type?: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
};

export type TransactionPagination = {
  page: number;
  pageSize: number;
};

export type TransactionsResponse = {
  data: Array<ApiTransaction>;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type CreateTransactionInput = {
  title: string;
  amount: number;
  type: TransactionType;
  category_id: number;
  transaction_date: string;
  notes: string | null;
};

export type TransactionSummary = {
  income: number;
  expenses: number;
  net: number;
};

export type AppSettings = {
  currency: string;
  starting_balance: string | number;
  tracking_start_date: string;
  savings_percentage: string | number;
  savings_basis: "income" | "current_savings";
  onboarding_completed: boolean;
};

export type CategorySpending = {
  name: string;
  amount: number;
};

export type MonthlyTotal = {
  month: string;
  label: string;
  income: number;
  expenses: number;
};

export type UpdateSettingsInput = {
  currency: string;
  starting_balance: number;
  tracking_start_date: string;
  savings_percentage: number;
  savings_basis: "income" | "current_savings";
};

function categoryNameFor(
  categories: Array<LocalCategory>,
  categoryId: number,
): string {
  const match = categories.find((category) => category.id === categoryId);
  return match ? match.name : "Uncategorized";
}

function toApiTransaction(
  row: LocalTransaction,
  categories: Array<LocalCategory>,
): ApiTransaction {
  return {
    id: row.id,
    title: row.title,
    amount: String(row.amount),
    type: row.type,
    category_id: row.category_id,
    category_name: categoryNameFor(categories, row.category_id),
    transaction_date: row.transaction_date,
    notes: row.notes,
    created_at: row.created_at,
  };
}

export async function getCategorySpending(): Promise<Array<CategorySpending>> {
  const categories = localStore.getCategories();
  const transactions = localStore.getTransactions();
  const fixedExpenses = localStore.getFixedExpenses();
  const totals = new Map<string, number>();

  transactions
    .filter((row) => row.type === "expense")
    .forEach((row) => {
      const name = categoryNameFor(categories, row.category_id);
      totals.set(name, (totals.get(name) ?? 0) + Number(row.amount));
    });

  fixedExpenses.forEach((expense: LocalFixedExpense) => {
    const monthly = monthlyAmount(expense);
    if (monthly <= 0) return;
    totals.set(expense.name, (totals.get(expense.name) ?? 0) + monthly);
  });

  return Array.from(totals.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export async function getMonthlyTotals(): Promise<Array<MonthlyTotal>> {
  const transactions = localStore.getTransactions();
  const incomeSources = localStore.getIncomeSources();
  const fixedExpenses = localStore.getFixedExpenses();
  const buckets = new Map<string, { income: number; expenses: number }>();

  const now = new Date();
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    buckets.set(key, { income: 0, expenses: 0 });
  }

  buckets.forEach((bucket, key) => {
    const [yearStr, monthStr] = key.split("-");
    const monthStart = new Date(Number(yearStr), Number(monthStr) - 1, 1);
    const monthEnd = new Date(Number(yearStr), Number(monthStr), 0);

    incomeSources.forEach((source: LocalIncomeSource) => {
      if (!isActiveInMonth(source, monthStart, monthEnd)) return;
      bucket.income += monthlyAmount(source);
    });

    fixedExpenses.forEach((expense: LocalFixedExpense) => {
      if (!isActiveInMonth(expense, monthStart, monthEnd)) return;
      bucket.expenses += monthlyAmount(expense);
    });
  });

  transactions.forEach((row) => {
    const date = new Date(row.transaction_date);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.get(key);
    if (!bucket) return;
    const amount = Number(row.amount);
    if (row.type === "income") bucket.income += amount;
    else bucket.expenses += amount;
  });

  return Array.from(buckets.entries()).map(([month, totals]) => {
    const [yearStr, monthStr] = month.split("-");
    const date = new Date(Number(yearStr), Number(monthStr) - 1, 1);
    const label = date.toLocaleDateString("en-US", { month: "short" });
    return { month, label, income: totals.income, expenses: totals.expenses };
  });
}

export async function getSettings(): Promise<AppSettings> {
  const settings = localStore.getSettings();
  return {
    currency: settings.currency,
    starting_balance: settings.starting_balance,
    tracking_start_date: settings.tracking_start_date,
    savings_percentage: settings.savings_percentage,
    savings_basis: settings.savings_basis,
    onboarding_completed: settings.onboarding_completed,
  };
}

export async function updateSettings(
  input: UpdateSettingsInput,
): Promise<AppSettings> {
  const next = localStore.patchSettings({
    currency: input.currency,
    starting_balance: input.starting_balance,
    tracking_start_date: input.tracking_start_date,
    savings_percentage: input.savings_percentage,
    savings_basis: input.savings_basis,
  });

  return {
    currency: next.currency,
    starting_balance: next.starting_balance,
    tracking_start_date: next.tracking_start_date,
    savings_percentage: next.savings_percentage,
    savings_basis: next.savings_basis,
    onboarding_completed: next.onboarding_completed,
  };
}

export async function getTransactions(
  filters: TransactionFilters = {},
  pagination: TransactionPagination = { page: 1, pageSize: 10 },
): Promise<TransactionsResponse> {
  const categories = localStore.getCategories();
  let rows = localStore.getTransactions();

  if (filters.search) {
    const q = filters.search.toLowerCase();
    rows = rows.filter((row) => row.title.toLowerCase().includes(q));
  }

  if (filters.type && filters.type !== "all") {
    rows = rows.filter((row) => row.type === filters.type);
  }

  if (filters.category_id && filters.category_id !== "all") {
    const id = Number(filters.category_id);
    rows = rows.filter((row) => row.category_id === id);
  }

  if (filters.start_date) {
    rows = rows.filter((row) => row.transaction_date >= filters.start_date!);
  }

  if (filters.end_date) {
    rows = rows.filter((row) => row.transaction_date <= filters.end_date!);
  }

  rows = rows.slice().sort((a, b) => {
    if (a.transaction_date === b.transaction_date) {
      return b.id - a.id;
    }
    return a.transaction_date < b.transaction_date ? 1 : -1;
  });

  const totalItems = rows.length;
  const pageSize = Math.max(1, pagination.pageSize);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(Math.max(1, pagination.page), totalPages);
  const start = (page - 1) * pageSize;
  const paged = rows.slice(start, start + pageSize);

  return {
    data: paged.map((row) => toApiTransaction(row, categories)),
    page,
    pageSize,
    totalItems,
    totalPages,
  };
}

export async function getTransactionSummary(): Promise<TransactionSummary> {
  const transactions = localStore.getTransactions();
  const incomeSources = localStore.getIncomeSources();
  const fixedExpenses = localStore.getFixedExpenses();

  let income = 0;
  let expenses = 0;

  incomeSources.forEach((source) => {
    income += monthlyAmount(source);
  });

  fixedExpenses.forEach((expense) => {
    expenses += monthlyAmount(expense);
  });

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  transactions.forEach((row) => {
    const date = new Date(row.transaction_date);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (key !== monthKey) return;
    const amount = Number(row.amount);
    if (row.type === "income") income += amount;
    else expenses += amount;
  });

  return { income, expenses, net: income - expenses };
}

export async function getCategories(): Promise<Array<ApiCategory>> {
  return localStore.getCategories().map((category) => ({
    id: category.id,
    name: category.name,
    type: category.type,
  }));
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<ApiTransaction> {
  const row = localStore.addTransaction(input);
  const categories = localStore.getCategories();
  return toApiTransaction(row, categories);
}

export async function updateTransaction(
  id: number,
  input: CreateTransactionInput,
): Promise<ApiTransaction> {
  const row = localStore.updateTransaction(id, input);
  const categories = localStore.getCategories();
  return toApiTransaction(row, categories);
}

export async function deleteTransaction(id: number): Promise<void> {
  localStore.deleteTransaction(id);
}

export const transactionQueries = {
  all: ["transactions"] as const,

  list: (
    filters: TransactionFilters = {},
    pagination: TransactionPagination = { page: 1, pageSize: 10 },
  ) =>
    queryOptions({
      queryKey: [...transactionQueries.all, filters, pagination] as const,
      queryFn: () => getTransactions(filters, pagination),
    }),

  summary: () =>
    queryOptions({
      queryKey: ["transaction-summary"] as const,
      queryFn: getTransactionSummary,
    }),

  categories: () =>
    queryOptions({
      queryKey: ["categories"] as const,
      queryFn: getCategories,
    }),

  settings: () =>
    queryOptions({
      queryKey: ["settings"] as const,
      queryFn: getSettings,
    }),

  categorySpending: () =>
    queryOptions({
      queryKey: ["category-spending"] as const,
      queryFn: getCategorySpending,
    }),

  monthly: () =>
    queryOptions({
      queryKey: ["transactions-monthly"] as const,
      queryFn: getMonthlyTotals,
    }),
};

function invalidateTransactionLists(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: transactionQueries.all }),
    queryClient.invalidateQueries({
      queryKey: transactionQueries.summary().queryKey,
    }),
    queryClient.invalidateQueries({
      queryKey: transactionQueries.categorySpending().queryKey,
    }),
    queryClient.invalidateQueries({
      queryKey: transactionQueries.monthly().queryKey,
    }),
  ]);
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTransaction"],
    mutationFn: createTransaction,
    onSuccess: () => invalidateTransactionLists(queryClient),
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateTransaction"],
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: CreateTransactionInput;
    }) => updateTransaction(id, input),
    onSuccess: () => invalidateTransactionLists(queryClient),
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteTransaction"],
    mutationFn: deleteTransaction,
    onSuccess: () => invalidateTransactionLists(queryClient),
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateSettings"],
    mutationFn: updateSettings,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: transactionQueries.settings().queryKey,
        }),
        queryClient.invalidateQueries({ queryKey: ["onboarding"] }),
      ]);
    },
  });
};
