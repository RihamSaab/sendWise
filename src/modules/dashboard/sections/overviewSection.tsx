"use client";

import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

import { transactionQueries } from "@/api/transactions";

import BalanceCard from "../components/balanceCard";

export default function OverviewSection() {
  const { data: settings } = useQuery(transactionQueries.settings());
  const { data: summary } = useQuery(transactionQueries.summary());

  const currency = settings?.currency ?? "USD";
  const startingBalance = Number(settings?.starting_balance ?? 0);
  const income = summary?.income ?? 0;
  const expenses = summary?.expenses ?? 0;
  const balance = startingBalance + income - expenses;

  return (
    <StyledOverviewSection>
      <StyledOverviewSection_Heading>
        <StyledOverviewSection_Title>Overview</StyledOverviewSection_Title>
      </StyledOverviewSection_Heading>

      <StyledOverviewSection_Cards>
        <BalanceCard title="Projected balance" amount={balance} currency={currency} />
        <BalanceCard title="Monthly income" amount={income} currency={currency} />
        <BalanceCard title="Monthly expenses" amount={expenses} currency={currency} />
      </StyledOverviewSection_Cards>
    </StyledOverviewSection>
  );
}

const StyledOverviewSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const StyledOverviewSection_Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const StyledOverviewSection_Title = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const StyledOverviewSection_Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-md);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--spacing-sm);
  }
`;
