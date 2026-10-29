import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { localStore, type LocalIncomeSource } from "./localStore";

export type IncomeFrequency = "weekly" | "monthly" | "yearly" | "one_time";

export type IncomeSource = {
  id: number;
  name: string;
  amount: string | number;
  frequency: IncomeFrequency;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
};

export type IncomeSourceInput = {
  name: string;
  amount: number;
  frequency: IncomeFrequency;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
};

function toApi(row: LocalIncomeSource): IncomeSource {
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

export async function getIncomeSources(): Promise<Array<IncomeSource>> {
  return localStore.getIncomeSources().map(toApi);
}

export async function createIncomeSource(
  input: IncomeSourceInput,
): Promise<IncomeSource> {
  return toApi(localStore.addIncomeSource(input));
}

export async function updateIncomeSource(
  id: number,
  input: IncomeSourceInput,
): Promise<IncomeSource> {
  return toApi(localStore.updateIncomeSource(id, input));
}

export async function deleteIncomeSource(id: number): Promise<void> {
  localStore.deleteIncomeSource(id);
}

export const incomeQueries = {
  all: ["income-sources"] as const,

  list: () =>
    queryOptions({
      queryKey: ["income-sources"] as const,
      queryFn: getIncomeSources,
    }),
};

function invalidateIncome(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: incomeQueries.all }),
    queryClient.invalidateQueries({ queryKey: ["transaction-summary"] }),
    queryClient.invalidateQueries({ queryKey: ["transactions-monthly"] }),
    queryClient.invalidateQueries({ queryKey: ["category-spending"] }),
  ]);
}

export const useCreateIncomeSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIncomeSource,
    onSuccess: () => invalidateIncome(queryClient),
  });
};

export const useUpdateIncomeSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: IncomeSourceInput }) =>
      updateIncomeSource(id, input),
    onSuccess: () => invalidateIncome(queryClient),
  });
};

export const useDeleteIncomeSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteIncomeSource,
    onSuccess: () => invalidateIncome(queryClient),
  });
};
