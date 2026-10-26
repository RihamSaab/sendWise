"use client";

import styled from "styled-components";
import type { ApiTransaction } from "@/api/transactions";

type TransactionsTableProps = {
  transactions: Array<ApiTransaction>;
  isPending: boolean;
  error: Error | null;
};

export default function TransactionsTable({
  transactions,
  isPending,
  error,
}: TransactionsTableProps) {
  return (
    <StyledTransactionsPage_TableCard>
      <StyledTransactionsPage_TableScroll>
        <StyledTransactionsPage_Table>
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>
                  <StyledTransactionsPage_TransactionName>
                    {transaction.title}
                  </StyledTransactionsPage_TransactionName>

                  <StyledTransactionsPage_TransactionMeta>
                    {transaction.type === "income"
                      ? "Money received"
                      : "Money spent"}
                  </StyledTransactionsPage_TransactionMeta>
                </td>

                <td>{transaction.category_name}</td>
                <td>{transaction.transaction_date}</td>

                <td>
                  <StyledTransactionsPage_Amount
                    $income={transaction.type === "income"}
                  >
                    {transaction.type === "income" ? "+" : "−"}
                    {Number(transaction.amount).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </StyledTransactionsPage_Amount>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTransactionsPage_Table>

        {isPending && (
          <StyledTransactionsPage_Empty>
            Loading transactions...
          </StyledTransactionsPage_Empty>
        )}

        {!isPending && error && (
          <StyledTransactionsPage_Empty>
            {error instanceof Error
              ? error.message
              : "Failed to load transactions."}
          </StyledTransactionsPage_Empty>
        )}

        {!isPending && !error && transactions.length === 0 && (
          <StyledTransactionsPage_Empty>
            No transactions found.
          </StyledTransactionsPage_Empty>
        )}
      </StyledTransactionsPage_TableScroll>
    </StyledTransactionsPage_TableCard>
  );
}

const StyledTransactionsPage_TableCard = styled.div`
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  background: var(--color-surface);
`;

const StyledTransactionsPage_TableScroll = styled.div`
  overflow-x: auto;
`;

const StyledTransactionsPage_Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th {
    padding: 14px 20px;
    background: var(--color-background);
    color: var(--color-text-secondary);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  td {
    padding: 16px 20px;
    border-top: 1px solid var(--color-border);
    color: var(--color-text);
    font-size: 13px;
  }

  @media (max-width: 720px) {
    min-width: 650px;
  }
`;

const StyledTransactionsPage_TransactionName = styled.div`
  font-weight: 600;
`;

const StyledTransactionsPage_TransactionMeta = styled.div`
  margin-top: 4px;
  color: var(--color-text-secondary);
  font-size: 12px;
`;

const StyledTransactionsPage_Amount = styled.span<{
  $income: boolean;
}>`
  color: ${({ $income }) =>
    $income ? "var(--color-primary)" : "var(--color-text)"};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const StyledTransactionsPage_Empty = styled.p`
  padding: 36px 20px;
  margin: 0;
  color: var(--color-text-secondary);
  text-align: center;
`;
