"use client";

import styled from "styled-components";

type TransactionSummaryProps = {
  income: number;
  expenses: number;
  net: number;
  isPending: boolean;
  error: Error | null;
};

const formatCurrency = (amount: number) =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

export default function TransactionSummary({
  income,
  expenses,
  net,
  isPending,
  error,
}: TransactionSummaryProps) {
  return (
    <>
      <StyledSummary>
        <StyledSummary_Card>
          <StyledSummary_Label>Total income</StyledSummary_Label>
          <StyledSummary_Amount>
            {isPending ? "Loading..." : formatCurrency(income)}
          </StyledSummary_Amount>
        </StyledSummary_Card>

        <StyledSummary_Card>
          <StyledSummary_Label>Total expenses</StyledSummary_Label>
          <StyledSummary_Amount>
            {isPending ? "Loading..." : formatCurrency(expenses)}
          </StyledSummary_Amount>
        </StyledSummary_Card>

        <StyledSummary_Card>
          <StyledSummary_Label>Net total</StyledSummary_Label>
          <StyledSummary_Amount>
            {isPending ? "Loading..." : formatCurrency(net)}
          </StyledSummary_Amount>
        </StyledSummary_Card>
      </StyledSummary>

      {error && <p role="alert">Could not load summary totals.</p>}
    </>
  );
}

const StyledSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const StyledSummary_Card = styled.article`
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
`;

const StyledSummary_Label = styled.p`
  margin: 0 0 10px;
  color: var(--color-text-secondary);
  font-size: 13px;
`;

const StyledSummary_Amount = styled.p`
  margin: 0;
  color: var(--color-text);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
`;
