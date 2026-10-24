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
  gap: 16px;
`;

const StyledTransactionsPage_Eyebrow = styled.p`
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const StyledTransactionsPage_Title = styled.h1`
  margin: 0;
  color: var(--color-text);
  font-size: clamp(28px, 4vw, 36px);
  font-weight: 600;
  letter-spacing: -0.045em;
`;

const StyledTransactionsPage_Description = styled.p`
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.7;
`;

const StyledTransactionsPage_AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  background: var(--color-primary);
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 160ms ease;

  &:hover {
    opacity: 0.9;
  }

  &:focus-visible {
    outline: 3px solid rgb(36 75 59 / 25%);
    outline-offset: 2px;
  }
`;
