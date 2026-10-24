
import { create } from "zustand";

import type { TransactionFilters } from "@/api/transactions";

type TransactionsStore = {
  filters: TransactionFilters;
  setFilters: (filters: Partial<TransactionFilters>) => void;
};

export const useTransactionsStore = create<TransactionsStore>()((set) => ({
  filters: {},

  setFilters: (filters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    }));
  },
}));
