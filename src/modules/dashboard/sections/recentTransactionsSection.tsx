"use client";
import { useQuery } from "@tanstack/react-query";
import TransactionRow from "../components/transactionRow";

import Link from "next/link";
import styled from "styled-components";
import { transactionQueries } from "@/api/transactions";

export default function RecentTransactionsSection() {
  const {
    data: transactions,
    isPending,
    isError,
  } = useQuery(transactionQueries.list({}, { page: 1, pageSize: 5 }));

  if (isPending) {
    return <p>Loading recent transactions...</p>;
  }

  if (isError) {
    return <p>Failed to load recent transactions.</p>;
  }

  return (
    <StyledRecentTransactionsSection>
      <StyledRecentTransactionsSection_Header>
        <div>
          <StyledRecentTransactionsSection_Title>
            Recent Transactions
          </StyledRecentTransactionsSection_Title>

          <StyledRecentTransactionsSection_Description>
            Your latest money activity.
          </StyledRecentTransactionsSection_Description>
        </div>

        <StyledRecentTransactionsSection_ViewAll href="/dashboard/transactions">
          View all
          <span aria-hidden="true">→</span>
        </StyledRecentTransactionsSection_ViewAll>
      </StyledRecentTransactionsSection_Header>

      <StyledRecentTransactionsSection_Card>
        {transactions.data.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={{
              id: String(transaction.id),
              name: transaction.title,
              category: transaction.category_name,
              date: transaction.transaction_date,
              amount: Number(transaction.amount),
              type: transaction.type,
            }}
          />
        ))}
      </StyledRecentTransactionsSection_Card>
    </StyledRecentTransactionsSection>
  );
}

const StyledRecentTransactionsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-width: 0;
`;

const StyledRecentTransactionsSection_Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const StyledRecentTransactionsSection_Title = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const StyledRecentTransactionsSection_Description = styled.p`
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
`;

const StyledRecentTransactionsSection_ViewAll = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  transition: gap 160ms ease;

  &:hover {
    gap: 12px;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
    border-radius: 3px;
  }
`;

const StyledRecentTransactionsSection_Card = styled.div`
  padding: 0 var(--spacing-lg);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--elevation-1);

  @media (max-width: 560px) {
    padding: 0 var(--spacing-md);
  }
`;
