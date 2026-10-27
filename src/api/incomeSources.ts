import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "./client";

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

export async function getIncomeSources(): Promise<Array<IncomeSource>> {
  const response = await apiClient.get<Array<IncomeSource>>("/income-sources");
  return response.data;
}

export async function createIncomeSource(
  input: IncomeSourceInput,
): Promise<IncomeSource> {
  const response = await apiClient.post<IncomeSource>(
    "/income-sources",
    input,
  );
  return response.data;
}

export async function updateIncomeSource(
  id: number,
  input: IncomeSourceInput,
): Promise<IncomeSource> {
  const response = await apiClient.put<IncomeSource>(
    `/income-sources/${id}`,
    input,
  );
  return response.data;
}

export async function deleteIncomeSource(id: number): Promise<void> {
  await apiClient.delete(`/income-sources/${id}`);
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
  return queryClient.invalidateQueries({ queryKey: incomeQueries.all });
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
