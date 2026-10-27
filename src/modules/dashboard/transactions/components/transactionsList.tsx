"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";

import {
  transactionQueries,
  type ApiTransaction,
} from "@/api/transactions";
import Pagination from "@/designSystem/pagination";
import { useTransactionsStore } from "@/stores/transactionsStore";

import useTransactionPagination from "../hooks/useTransactionPagination";
import AddTransactionModal from "./addTransactionModal";
import DeleteTransactionDialog from "./deleteTransactionDialog";
import TransactionsHeader from "./transactionsHeader";
import TransactionFilters from "./transactionFilters";
import TransactionsTable from "./transactionsTable";
import TransactionSummary from "./transactionSummary";

export default function TransactionsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<ApiTransaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<ApiTransaction | null>(null);

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

  const { data: settings } = useQuery(transactionQueries.settings());
  const currency = settings?.currency ?? "USD";

  function openAddModal() {
    setEditingTransaction(null);
    setIsModalOpen(true);
  }

  function openEditModal(transaction: ApiTransaction) {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTransaction(null);
  }

  return (
    <StyledTransactionsPage>
      <TransactionsHeader onAddTransaction={openAddModal} />

      <TransactionSummary
        income={summary.income}
        expenses={summary.expenses}
        net={summary.net}
        currency={currency}
        isPending={isSummaryPending}
        error={summaryError}
      />

      <section aria-label="Transaction history">
        <TransactionFilters />

        <TransactionsTable
          transactions={transactions}
          currency={currency}
          isPending={areTransactionsPending}
          error={transactionsError}
          onEdit={openEditModal}
          onDelete={setDeletingTransaction}
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
        <AddTransactionModal
          onClose={closeModal}
          transaction={editingTransaction}
        />
      )}

      {deletingTransaction && (
        <DeleteTransactionDialog
          transaction={deletingTransaction}
          onClose={() => setDeletingTransaction(null)}
        />
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
