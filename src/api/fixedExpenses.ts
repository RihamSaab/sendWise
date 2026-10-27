import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "./client";
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

export async function getFixedExpenses(): Promise<Array<FixedExpense>> {
  const response = await apiClient.get<Array<FixedExpense>>("/fixed-expenses");
  return response.data;
}

export async function createFixedExpense(
  input: FixedExpenseInput,
): Promise<FixedExpense> {
  const response = await apiClient.post<FixedExpense>(
    "/fixed-expenses",
    input,
  );
  return response.data;
}

export async function updateFixedExpense(
  id: number,
  input: FixedExpenseInput,
): Promise<FixedExpense> {
  const response = await apiClient.put<FixedExpense>(
    `/fixed-expenses/${id}`,
    input,
  );
  return response.data;
}

export async function deleteFixedExpense(id: number): Promise<void> {
  await apiClient.delete(`/fixed-expenses/${id}`);
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
  return queryClient.invalidateQueries({ queryKey: fixedExpenseQueries.all });
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
