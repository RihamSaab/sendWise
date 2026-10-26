"use client";

import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";

import { transactionQueries } from "@/api/transactions";
import { useTransactionsStore } from "@/stores/transactionsStore";
import Select, { type SelectOption } from "@/designSystem/select";

const typeOptions: Array<SelectOption> = [
  { value: "all", label: "All types" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expenses" },
];

export default function TransactionFilters() {
  const filters = useTransactionsStore((state) => state.filters);
  const setFilters = useTransactionsStore((state) => state.setFilters);

  const {
    data: categories = [],
    isPending,
    error,
  } = useQuery(transactionQueries.categories());

  const categoryOptions: Array<SelectOption> = [
    { value: "all", label: "All categories" },
    ...categories.map((category) => ({
      value: String(category.id),
      label: category.name,
    })),
  ];

  return (
    <StyledTransactionsPage_Toolbar>
      <StyledTransactionsPage_Search
        type="search"
        placeholder="Search transactions..."
        aria-label="Search transactions"
        value={filters.search ?? ""}
        onChange={(event) =>
          setFilters({ search: event.target.value || undefined })
        }
      />

      <Select
        ariaLabel="Filter by transaction type"
        value={filters.type ?? "all"}
        options={typeOptions}
        onValueChange={(value) =>
          setFilters({ type: value === "all" ? undefined : value })
        }
      />

      <Select
        ariaLabel="Filter by category"
        value={filters.category_id ?? "all"}
        options={categoryOptions}
        onValueChange={(value) =>
          setFilters({
            category_id: value === "all" ? undefined : value,
          })
        }
      />

      {isPending && <span>Loading categories...</span>}

      {error && <span>Could not load categories.</span>}
    </StyledTransactionsPage_Toolbar>
  );
}

const StyledTransactionsPage_Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-bottom: none;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background: var(--color-surface);
`;

const StyledTransactionsPage_Search = styled.input`
  flex: 1;
  min-width: 180px;
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  outline: none;
  background: var(--color-background);
  color: var(--color-text);

  &::placeholder {
    color: var(--color-text-secondary);
  }

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(36 75 59 / 8%);
  }
`;
