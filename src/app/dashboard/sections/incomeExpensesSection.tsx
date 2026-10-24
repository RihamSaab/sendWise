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

import styled from "styled-components";

const monthlyData = [
  { month: "May", income: 3200, expenses: 1800 },
  { month: "Jun", income: 3500, expenses: 2100 },
  { month: "Jul", income: 3100, expenses: 1900 },
  { month: "Aug", income: 3800, expenses: 2300 },
  { month: "Sep", income: 3400, expenses: 2000 },
  { month: "Oct", income: 4000, expenses: 2200 },
];

const formatCurrency = (amount: number) => `$${amount.toLocaleString("en-US")}`;

export default function IncomeExpensesSection() {
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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 12, right: 8, left: 8, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid
              stroke="var(--color-border)"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
              tickFormatter={(value: number) => `$${value / 1000}k`}
              width={48}
            />

            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                boxShadow: "0 6px 20px rgb(37 41 35 / 8%)",
                padding: "12px 14px",
              }}
              labelStyle={{
                color: "var(--color-text)",
                fontWeight: 600,
                marginBottom: 6,
              }}
              cursor={{ fill: "rgba(36, 75, 59, 0.05)" }}
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
              fill="#244B3B"
              radius={[5, 5, 0, 0]}
              maxBarSize={24}
            />

            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#D9A477"
              radius={[5, 5, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </StyledIncomeExpensesSection_Chart>
    </StyledIncomeExpensesSection>
  );
}


const StyledIncomeExpensesSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

const StyledIncomeExpensesSection_Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const StyledIncomeExpensesSection_Title = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const StyledIncomeExpensesSection_Description = styled.p`
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
`;

const StyledIncomeExpensesSection_Chart = styled.div`
  width: 100%;
  height: 340px;
  min-width: 0;
  padding: 24px 20px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: 0 2px 8px rgb(37 41 35 / 3%);

  @media (max-width: 560px) {
    height: 300px;
    padding: 20px 8px 12px;
  }
`;
