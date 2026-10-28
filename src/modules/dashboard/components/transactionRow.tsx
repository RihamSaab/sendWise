import { transactionQueries, TransactionType } from "@/api/transactions";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

export type Transaction = {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
};

type TransactionRowProps = {
  transaction: Transaction;
};

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const { data: settings } = useQuery(transactionQueries.settings());

  const currency = settings?.currency ?? "USD";
  const isIncome = transaction.type === "income";

  const formattedAmount = Math.abs(transaction.amount).toLocaleString("en-US", {
    style: "currency",
    currency: currency,
  });

  return (
    <StyledTransactionRow>
      <StyledTransactionRow_Icon $type={transaction.type}>
        {isIncome ? "+" : "−"}
      </StyledTransactionRow_Icon>

      <StyledTransactionRow_Details>
        <StyledTransactionRow_Name>
          {transaction.name}
        </StyledTransactionRow_Name>

        <StyledTransactionRow_Meta>
          <StyledTransactionRow_Category>
            {transaction.category}
          </StyledTransactionRow_Category>
          <span>·</span>
          <span>{transaction.date}</span>
        </StyledTransactionRow_Meta>
      </StyledTransactionRow_Details>

      <StyledTransactionRow_Amount $type={transaction.type}>
        {isIncome ? "+" : "−"}
        {formattedAmount}
      </StyledTransactionRow_Amount>
    </StyledTransactionRow>
  );
}

const StyledTransactionRow = styled.article`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
  border-bottom: var(--stroke) solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }
`;

const StyledTransactionRow_Icon = styled.div<{
  $type: TransactionType;
}>`
  display: grid;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  place-items: center;
  border-radius: var(--radius-lg);
  background: ${({ $type }) =>
    $type === "income"
      ? "var(--color-primary-soft)"
      : "var(--color-surface-muted)"};
  color: ${({ $type }) =>
    $type === "income"
      ? "var(--color-primary)"
      : "var(--color-text-secondary)"};
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: 500;
`;

const StyledTransactionRow_Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const StyledTransactionRow_Name = styled.span`
  overflow: hidden;
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledTransactionRow_Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
`;

const StyledTransactionRow_Category = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledTransactionRow_Amount = styled.span<{
  $type: TransactionType;
}>`
  flex-shrink: 0;
  color: ${({ $type }) =>
    $type === "income" ? "var(--color-primary)" : "var(--color-text)"};
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
`;
