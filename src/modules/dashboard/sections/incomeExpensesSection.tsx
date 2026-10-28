"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

import { transactionQueries } from "@/api/transactions";
import { formatCurrency } from "@/shared/formatCurrency";
import { chartPalette } from "@/styles/chartPalette";

export default function IncomeExpensesSection() {
  const { data: monthly, isPending, isError } = useQuery(
    transactionQueries.monthly(),
  );
  const { data: settings } = useQuery(transactionQueries.settings());

  const currency = settings?.currency ?? "USD";

  return (
    <StyledIncomeExpensesSection>
      <StyledIncomeExpensesSection_Header>
        <div>
          <StyledIncomeExpensesSection_Title>
            Income vs. Expenses
          </StyledIncomeExpensesSection_Title>

          <StyledIncomeExpensesSection_Description>
            Track how your money flows each month.
          </StyledIncomeExpensesSection_Description>
        </div>
      </StyledIncomeExpensesSection_Header>

      <StyledIncomeExpensesSection_Chart>
        {isPending ? (
          <StyledIncomeExpensesSection_Message>
            Loading chart...
          </StyledIncomeExpensesSection_Message>
        ) : isError ? (
          <StyledIncomeExpensesSection_Message>
            Could not load monthly totals.
          </StyledIncomeExpensesSection_Message>
        ) : monthly && monthly.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthly}
              margin={{ top: 12, right: 8, left: 8, bottom: 0 }}
              barGap={8}
            >
              <CartesianGrid
                stroke={chartPalette.grid}
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: chartPalette.axis, fontSize: 11 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: chartPalette.axis, fontSize: 11 }}
                tickFormatter={(value: number) => `${value / 1000}k`}
                width={48}
              />

              <Tooltip
                formatter={(value) => formatCurrency(Number(value), currency)}
                contentStyle={{
                  backgroundColor: chartPalette.tooltipBg,
                  border: `1px solid ${chartPalette.tooltipBorder}`,
                  borderRadius: "8px",
                  boxShadow: chartPalette.tooltipShadow,
                  padding: "12px 14px",
                  fontFamily: "var(--font-mono)",
                }}
                labelStyle={{
                  color: "var(--color-text)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
                cursor={{ fill: chartPalette.cursor }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingBottom: 24,
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                }}
              />

              <Bar
                dataKey="income"
                name="Income"
                fill={chartPalette.income}
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />

              <Bar
                dataKey="expenses"
                name="Expenses"
                fill={chartPalette.expense}
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <StyledIncomeExpensesSection_Message>
            No transactions in the last six months.
          </StyledIncomeExpensesSection_Message>
        )}
      </StyledIncomeExpensesSection_Chart>
    </StyledIncomeExpensesSection>
  );
}

const StyledIncomeExpensesSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-width: 0;
`;

const StyledIncomeExpensesSection_Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const StyledIncomeExpensesSection_Title = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const StyledIncomeExpensesSection_Description = styled.p`
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
`;

const StyledIncomeExpensesSection_Chart = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 340px;
  min-width: 0;
  padding: var(--spacing-lg) var(--spacing-md) var(--spacing-md);
  border: none;
  border-radius: var(--radius-xl);
  background: var(--gradient-surface);
  box-shadow:
    var(--specular-top),
    var(--elevation-1);

  @media (max-width: 560px) {
    height: 300px;
    padding: var(--spacing-md) var(--spacing-sm) 12px;
  }
`;

const StyledIncomeExpensesSection_Message = styled.p`
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  text-align: center;
`;
