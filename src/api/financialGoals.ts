import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { localStore, type LocalFinancialGoal } from "./localStore";

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

function toApi(row: LocalFinancialGoal): FinancialGoal {
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

export async function getFinancialGoals(): Promise<Array<FinancialGoal>> {
  return localStore.getFinancialGoals().map(toApi);
}

export async function createFinancialGoal(
  input: FinancialGoalInput,
): Promise<FinancialGoal> {
  return toApi(localStore.addFinancialGoal(input));
}

export async function updateFinancialGoal(
  id: number,
  input: FinancialGoalInput,
): Promise<FinancialGoal> {
  return toApi(localStore.updateFinancialGoal(id, input));
}

export async function deleteFinancialGoal(id: number): Promise<void> {
  localStore.deleteFinancialGoal(id);
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
