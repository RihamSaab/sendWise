"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";

import { transactionQueries } from "@/api/transactions";
import type { ApiTransaction } from "@/api/transactions";
import Pagination from "@/designSystem/pagination";
import { useTransactionsStore } from "@/stores/transactionsStore";

import useTransactionPagination from "../hooks/useTransactionPagination";
import AddTransactionModal from "./addTransactionModal";
import TransactionsHeader from "./transactionsHeader";
import TransactionFilters from "./transactionFilters";
import TransactionsTable from "./transactionsTable";
import TransactionSummary from "./transactionSummary";

export default function TransactionsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = useTransactionsStore((state) => state.filters);
  const previousFilters = useRef(filters);

  const {
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    resetPage,
    correctOutOfRangePage,
  } = useTransactionPagination();

  useEffect(() => {
    if (previousFilters.current !== filters) {
      previousFilters.current = filters;

      if (page !== 1) {
        resetPage();
      }
    }
  }, [filters, page, resetPage]);

  const {
    data: transactionsResponse,
    isPending: areTransactionsPending,
    error: transactionsError,
  } = useQuery(transactionQueries.list(filters, { page, pageSize }));

  const transactions: Array<ApiTransaction> = transactionsResponse?.data ?? [];

  useEffect(() => {
    if (transactionsResponse) {
      correctOutOfRangePage(transactionsResponse.totalPages);
    }
  }, [transactionsResponse, correctOutOfRangePage]);

  const {
    data: summary = { income: 0, expenses: 0, net: 0 },
    isPending: isSummaryPending,
    error: summaryError,
  } = useQuery(transactionQueries.summary());

  function openModal() {
    setIsModalOpen(true);
  }

  return (
    <StyledTransactionsPage>
      <TransactionsHeader onAddTransaction={openModal} />

      <TransactionSummary
        income={summary.income}
        expenses={summary.expenses}
        net={summary.net}
        isPending={isSummaryPending}
        error={summaryError}
      />

      {summaryError && <p role="alert">Could not load summary totals.</p>}

      <section aria-label="Transaction history">
        <TransactionFilters />

        <TransactionsTable
          transactions={transactions}
          isPending={areTransactionsPending}
          error={transactionsError}
        />

        <Pagination
          page={transactionsResponse?.page ?? page}
          pageSize={transactionsResponse?.pageSize ?? pageSize}
          totalItems={transactionsResponse?.totalItems ?? 0}
          totalPages={transactionsResponse?.totalPages ?? 0}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </section>

      {isModalOpen && (
        <AddTransactionModal onClose={() => setIsModalOpen(false)} />
      )}
    </StyledTransactionsPage>
  );
}

const StyledTransactionsPage = styled.main`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;
