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
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: 0 2px 8px rgb(37 41 35 / 3%);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgb(37 41 35 / 6%);
  }
`;

const StyledBalanceCard_Title = styled.h3`
  margin: 0 0 12px;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
`;

const StyledBalanceCard_Amount = styled.p`
  margin: 0;
  color: var(--color-primary);
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
`;
