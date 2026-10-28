import styled from "styled-components";

import { formatCurrency } from "@/shared/formatCurrency";

type BalanceCardProps = {
  title: string;
  amount: number;
  currency?: string;
};

export default function BalanceCard({
  title,
  amount,
  currency = "USD",
}: BalanceCardProps) {
  return (
    <StyledBalanceCard>
      <StyledBalanceCard_Title>{title}</StyledBalanceCard_Title>
      <StyledBalanceCard_Amount>
        {formatCurrency(amount, currency)}
      </StyledBalanceCard_Amount>
    </StyledBalanceCard>
  );
}

const StyledBalanceCard = styled.article`
  min-width: 0;
  padding: var(--spacing-lg);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--elevation-1);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-border-strong);
    box-shadow: var(--elevation-2);
  }
`;

const StyledBalanceCard_Title = styled.h3`
  margin: 0 0 var(--spacing-sm);
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const StyledBalanceCard_Amount = styled.p`
  margin: 0;
  color: var(--color-primary);
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  font-weight: 500;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
`;
