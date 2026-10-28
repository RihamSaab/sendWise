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
  border: none;
  border-radius: var(--radius-xl);
  background: var(--gradient-surface);
  box-shadow:
    var(--specular-top),
    var(--elevation-1);
  transition:
    transform var(--dur-base) var(--ease-silk),
    box-shadow var(--dur-base) var(--ease-silk);

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      var(--specular-top),
      var(--elevation-3);
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
