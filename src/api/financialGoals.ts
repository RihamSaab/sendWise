import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "./client";

export type FinancialGoal = {
  id: number;
  name: string;
  target_amount: string | number;
  current_amount: string | number;
  target_date: string | null;
  notes: string | null;
  is_active: boolean;
};

export type FinancialGoalInput = {
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  notes: string | null;
  is_active: boolean;
};

export async function getFinancialGoals(): Promise<Array<FinancialGoal>> {
  const response = await apiClient.get<Array<FinancialGoal>>(
    "/financial-goals",
  );
  return response.data;
}

export async function createFinancialGoal(
  input: FinancialGoalInput,
): Promise<FinancialGoal> {
  const response = await apiClient.post<FinancialGoal>(
    "/financial-goals",
    input,
  );
  return response.data;
}

export async function updateFinancialGoal(
  id: number,
  input: FinancialGoalInput,
): Promise<FinancialGoal> {
  const response = await apiClient.put<FinancialGoal>(
    `/financial-goals/${id}`,
    input,
  );
  return response.data;
}

export async function deleteFinancialGoal(id: number): Promise<void> {
  await apiClient.delete(`/financial-goals/${id}`);
}

export const goalQueries = {
  all: ["financial-goals"] as const,

  list: () =>
    queryOptions({
      queryKey: ["financial-goals"] as const,
      queryFn: getFinancialGoals,
    }),
};

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: goalQueries.all });
}

export const useCreateFinancialGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFinancialGoal,
    onSuccess: () => invalidate(queryClient),
  });
};

export const useUpdateFinancialGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: FinancialGoalInput }) =>
      updateFinancialGoal(id, input),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useDeleteFinancialGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFinancialGoal,
    onSuccess: () => invalidate(queryClient),
  });
};
