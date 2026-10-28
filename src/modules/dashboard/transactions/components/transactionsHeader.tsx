"use client";

import styled from "styled-components";

type TransactionsHeaderProps = {
  onAddTransaction: () => void;
};

export default function TransactionsHeader({
  onAddTransaction,
}: TransactionsHeaderProps) {
  return (
    <StyledTransactionsPage_Header>
      <div>
        <StyledTransactionsPage_Eyebrow>
          YOUR FINANCES
        </StyledTransactionsPage_Eyebrow>

        <StyledTransactionsPage_Title>
          Transactions
        </StyledTransactionsPage_Title>

        <StyledTransactionsPage_Description>
          Track and manage your income and expenses.
        </StyledTransactionsPage_Description>
      </div>

      <StyledTransactionsPage_AddButton
        type="button"
        onClick={onAddTransaction}
      >
        + Add transaction
      </StyledTransactionsPage_AddButton>
    </StyledTransactionsPage_Header>
  );
}

const StyledTransactionsPage_Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const StyledTransactionsPage_Eyebrow = styled.p`
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const StyledTransactionsPage_Title = styled.h1`
  margin: 0;
  color: var(--color-text);
  font-size: clamp(28px, 4vw, 34px);
  font-weight: 600;
  letter-spacing: -0.035em;
`;

const StyledTransactionsPage_Description = styled.p`
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  line-height: 1.7;
`;

const StyledTransactionsPage_AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  min-height: 42px;
  padding: 0 var(--spacing-lg);
  border: none;
  border-radius: var(--radius-pill);
  background: var(--gradient-primary);
  box-shadow:
    var(--specular-top-dark),
    var(--elevation-1);
  color: var(--color-text-on-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    background var(--dur-base) var(--ease-silk),
    transform var(--dur-base) var(--ease-silk),
    box-shadow var(--dur-base) var(--ease-silk);

  &:hover {
    transform: translateY(-2px);
    background: var(--gradient-primary-hover);
    box-shadow:
      var(--specular-top-dark),
      var(--elevation-3);
  }

  &:focus-visible {
    outline: 2px solid var(--color-amber);
    outline-offset: 2px;
  }
`;
