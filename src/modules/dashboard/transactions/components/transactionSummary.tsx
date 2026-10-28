"use client";

import styled from "styled-components";

import { formatCurrency } from "@/shared/formatCurrency";

type TransactionSummaryProps = {
  income: number;
  expenses: number;
  net: number;
  currency: string;
  isPending: boolean;
  error: Error | null;
};

export default function TransactionSummary({
  income,
  expenses,
  net,
  currency,
  isPending,
  error,
}: TransactionSummaryProps) {
  return (
    <>
      <StyledSummary>
        <StyledSummary_Card>
          <StyledSummary_Label>Total income</StyledSummary_Label>
          <StyledSummary_Amount>
            {isPending ? "Loading..." : formatCurrency(income, currency)}
          </StyledSummary_Amount>
        </StyledSummary_Card>

        <StyledSummary_Card>
          <StyledSummary_Label>Total expenses</StyledSummary_Label>
          <StyledSummary_Amount>
            {isPending ? "Loading..." : formatCurrency(expenses, currency)}
          </StyledSummary_Amount>
        </StyledSummary_Card>

        <StyledSummary_Card>
          <StyledSummary_Label>Net total</StyledSummary_Label>
          <StyledSummary_Amount>
            {isPending ? "Loading..." : formatCurrency(net, currency)}
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
  gap: var(--spacing-md);

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const StyledSummary_Card = styled.article`
  padding: var(--spacing-lg);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--elevation-1);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    border-color: var(--color-border-strong);
    box-shadow: var(--elevation-2);
  }
`;

const StyledSummary_Label = styled.p`
  margin: 0 0 10px;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const StyledSummary_Amount = styled.p`
  margin: 0;
  color: var(--color-primary);
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  font-weight: 500;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
`;
