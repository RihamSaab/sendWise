import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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
};

export type CategorySpending = {
  name: string;
  amount: number;
};

export async function getCategorySpending(): Promise<Array<CategorySpending>> {
  const response = await axiosInstance.get<Array<CategorySpending>>(
    "/transactions/category-spending",
  );

  return response.data;
}

export async function getSettings(): Promise<AppSettings> {
  const response = await axiosInstance.get<AppSettings>("/settings");

  return response.data;
}

export async function getTransactions(
  filters: TransactionFilters = {},
  pagination: TransactionPagination = { page: 1, pageSize: 10 },
): Promise<TransactionsResponse> {
  const response = await axiosInstance.get<TransactionsResponse>(
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
  const response = await axiosInstance.get<TransactionSummary>(
    "/transactions/summary",
  );

  return response.data;
}

export async function getCategories(): Promise<Array<ApiCategory>> {
  const response = await axiosInstance.get<Array<ApiCategory>>("/categories");

  return response.data;
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<ApiTransaction> {
  const response = await axiosInstance.post<ApiTransaction>(
    "/transactions",
    input,
  );

  return response.data;
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
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTransaction"],
    mutationFn: createTransaction,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: transactionQueries.all,
        }),
        queryClient.invalidateQueries({
          queryKey: transactionQueries.summary().queryKey,
        }),
      ]);
    },
  });
};
