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
  gap: 14px;
  padding: 17px 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }
`;

const StyledTransactionRow_Icon = styled.div<{
  $type: TransactionType;
}>`
  display: grid;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 14px;
  background: ${({ $type }) =>
    $type === "income" ? "var(--color-sage)" : "var(--color-background)"};
  color: ${({ $type }) =>
    $type === "income"
      ? "var(--color-primary)"
      : "var(--color-text-secondary)"};
  font-size: 21px;
  font-weight: 500;
`;

const StyledTransactionRow_Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 0;
`;

const StyledTransactionRow_Name = styled.span`
  overflow: hidden;
  color: var(--color-text);
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledTransactionRow_Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--color-text-secondary);
  font-size: 12px;
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
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;
