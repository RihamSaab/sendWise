import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { localStore, type LocalFixedExpense } from "./localStore";
import type { IncomeFrequency } from "./incomeSources";

export type FixedExpense = {
  id: number;
  name: string;
  amount: string | number;
  frequency: IncomeFrequency;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
};

export type FixedExpenseInput = {
  name: string;
  amount: number;
  frequency: IncomeFrequency;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
};

function toApi(row: LocalFixedExpense): FixedExpense {
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

export async function getFixedExpenses(): Promise<Array<FixedExpense>> {
  return localStore.getFixedExpenses().map(toApi);
}

export async function createFixedExpense(
  input: FixedExpenseInput,
): Promise<FixedExpense> {
  return toApi(localStore.addFixedExpense(input));
}

export async function updateFixedExpense(
  id: number,
  input: FixedExpenseInput,
): Promise<FixedExpense> {
  return toApi(localStore.updateFixedExpense(id, input));
}

export async function deleteFixedExpense(id: number): Promise<void> {
  localStore.deleteFixedExpense(id);
}

export const fixedExpenseQueries = {
  all: ["fixed-expenses"] as const,

  list: () =>
    queryOptions({
      queryKey: ["fixed-expenses"] as const,
      queryFn: getFixedExpenses,
    }),
};

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: fixedExpenseQueries.all }),
    queryClient.invalidateQueries({ queryKey: ["transaction-summary"] }),
    queryClient.invalidateQueries({ queryKey: ["transactions-monthly"] }),
    queryClient.invalidateQueries({ queryKey: ["category-spending"] }),
  ]);
}

export const useCreateFixedExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFixedExpense,
    onSuccess: () => invalidate(queryClient),
  });
};

export const useUpdateFixedExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: FixedExpenseInput }) =>
      updateFixedExpense(id, input),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useDeleteFixedExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFixedExpense,
    onSuccess: () => invalidate(queryClient),
  });
};
