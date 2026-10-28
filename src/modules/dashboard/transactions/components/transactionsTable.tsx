"use client";

import styled from "styled-components";

import type { ApiTransaction } from "@/api/transactions";
import { formatCurrency } from "@/shared/formatCurrency";

type TransactionsTableProps = {
  transactions: Array<ApiTransaction>;
  currency: string;
  isPending: boolean;
  error: Error | null;
  onEdit: (transaction: ApiTransaction) => void;
  onDelete: (transaction: ApiTransaction) => void;
};

export default function TransactionsTable({
  transactions,
  currency,
  isPending,
  error,
  onEdit,
  onDelete,
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
              <StyledTransactionsPage_ActionsHeader scope="col">
                <span className="visually-hidden">Actions</span>
              </StyledTransactionsPage_ActionsHeader>
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
                    {formatCurrency(transaction.amount, currency)}
                  </StyledTransactionsPage_Amount>
                </td>

                <StyledTransactionsPage_ActionsCell>
                  <StyledTransactionsPage_RowButton
                    type="button"
                    onClick={() => onEdit(transaction)}
                    aria-label={`Edit ${transaction.title}`}
                  >
                    Edit
                  </StyledTransactionsPage_RowButton>

                  <StyledTransactionsPage_RowButton
                    type="button"
                    $danger
                    onClick={() => onDelete(transaction)}
                    aria-label={`Delete ${transaction.title}`}
                  >
                    Delete
                  </StyledTransactionsPage_RowButton>
                </StyledTransactionsPage_ActionsCell>
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
  border: var(--stroke) solid var(--color-border);
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
    padding: 14px var(--spacing-md);
    background: var(--color-surface-muted);
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    border-bottom: var(--stroke) solid var(--color-border);
  }

  td {
    padding: var(--spacing-md);
    border-top: var(--stroke) solid var(--color-border);
    color: var(--color-text);
    font-size: var(--text-sm);
  }

  tbody tr:first-child td {
    border-top: none;
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
  color: var(--color-text-muted);
  font-size: var(--text-xs);
`;

const StyledTransactionsPage_Amount = styled.span<{
  $income: boolean;
}>`
  color: ${({ $income }) =>
    $income ? "var(--color-primary)" : "var(--color-text)"};
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const StyledTransactionsPage_Empty = styled.p`
  padding: var(--spacing-xl) var(--spacing-md);
  margin: 0;
  color: var(--color-text-muted);
  text-align: center;
`;

const StyledTransactionsPage_ActionsHeader = styled.th`
  width: 1%;
  text-align: right;

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

const StyledTransactionsPage_ActionsCell = styled.td`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  white-space: nowrap;
`;

const StyledTransactionsPage_RowButton = styled.button<{ $danger?: boolean }>`
  min-height: 32px;
  padding: 0 var(--spacing-sm);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: ${({ $danger }) =>
    $danger ? "var(--color-error)" : "var(--color-text)"};
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: border-color 150ms ease;

  &:hover {
    border-color: ${({ $danger }) =>
      $danger ? "var(--color-error)" : "var(--color-primary)"};
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;
