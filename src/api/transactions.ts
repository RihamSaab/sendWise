import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "./client";

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

export async function getCategorySpending(): Promise<Array<CategorySpending>> {
  const response = await apiClient.get<Array<CategorySpending>>(
    "/transactions/category-spending",
  );

  return response.data;
}

export async function getMonthlyTotals(): Promise<Array<MonthlyTotal>> {
  const response = await apiClient.get<Array<MonthlyTotal>>(
    "/transactions/monthly",
  );

  return response.data;
}

export async function getSettings(): Promise<AppSettings> {
  const response = await apiClient.get<AppSettings>("/settings");

  return response.data;
}

export type UpdateSettingsInput = {
  currency: string;
  starting_balance: number;
  tracking_start_date: string;
  savings_percentage: number;
  savings_basis: "income" | "current_savings";
};

export async function updateSettings(
  input: UpdateSettingsInput,
): Promise<AppSettings> {
  const response = await apiClient.put<AppSettings>("/settings", input);

  return response.data;
}

export async function getTransactions(
  filters: TransactionFilters = {},
  pagination: TransactionPagination = { page: 1, pageSize: 10 },
): Promise<TransactionsResponse> {
  const response = await apiClient.get<TransactionsResponse>(
    "/transactions",
    {
      params: {
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize,
      },
    },
  );

  return response.data;
}

export async function getTransactionSummary(): Promise<TransactionSummary> {
  const response = await apiClient.get<TransactionSummary>(
    "/transactions/summary",
  );

  return response.data;
}

export async function getCategories(): Promise<Array<ApiCategory>> {
  const response = await apiClient.get<Array<ApiCategory>>("/categories");

  return response.data;
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<ApiTransaction> {
  const response = await apiClient.post<ApiTransaction>(
    "/transactions",
    input,
  );

  return response.data;
}

export async function updateTransaction(
  id: number,
  input: CreateTransactionInput,
): Promise<ApiTransaction> {
  const response = await apiClient.put<ApiTransaction>(
    `/transactions/${id}`,
    input,
  );

  return response.data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await apiClient.delete(`/transactions/${id}`);
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
