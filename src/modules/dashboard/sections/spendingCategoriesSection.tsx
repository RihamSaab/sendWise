"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { transactionQueries } from "@/api/transactions";
import { chartPalette } from "@/styles/chartPalette";
import styled from "styled-components";

const categoryColors = chartPalette.categories;

const formatCurrency = (amount: number, currency: string) =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency,
  });

export default function SpendingCategoriesSection() {
  const {
    data: categoriesData,
    isPending,
    isError,
  } = useQuery(transactionQueries.categorySpending());
  const { data: settings } = useQuery(transactionQueries.settings());

  const currency = settings?.currency ?? "USD";

  const categories = (categoriesData ?? []).map((category, index) => ({
    ...category,
    color: categoryColors[index % categoryColors.length],
  }));

  const totalSpending = categories.reduce(
    (total, category) => total + category.amount,
    0,
  );

  if (isPending) {
    return (
      <StyledSpendingCategoriesSection>
        <p>Loading spending categories...</p>
      </StyledSpendingCategoriesSection>
    );
  }

  if (isError) {
    return (
      <StyledSpendingCategoriesSection>
        <p>Failed to load spending categories.</p>
      </StyledSpendingCategoriesSection>
    );
  }

  return (
    <StyledSpendingCategoriesSection>
      <StyledSpendingCategoriesSection_Header>
        <div>
          <StyledSpendingCategoriesSection_Title>
            Spending by Category
          </StyledSpendingCategoriesSection_Title>

          <StyledSpendingCategoriesSection_Description>
            See where your money goes.
          </StyledSpendingCategoriesSection_Description>
        </div>
      </StyledSpendingCategoriesSection_Header>

      <StyledSpendingCategoriesSection_Card>
        {categories.length === 0 ? (
          <StyledSpendingCategoriesSection_Empty>
            No expenses recorded yet.
          </StyledSpendingCategoriesSection_Empty>
        ) : (
          <>
            <StyledSpendingCategoriesSection_ChartArea>
              <StyledSpendingCategoriesSection_Chart>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="amount"
                      nameKey="name"
                      innerRadius="66%"
                      outerRadius="88%"
                      paddingAngle={3}
                      stroke="none"
                    >
                      {categories.map((category) => (
                        <Cell key={category.name} fill={category.color} />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(Number(value), currency)
                      }
                      wrapperStyle={{
                        zIndex: 10,
                        outline: "none",
                        pointerEvents: "none",
                      }}
                      contentStyle={{
                        backgroundColor: chartPalette.tooltipBg,
                        border: `1px solid ${chartPalette.tooltipBorder}`,
                        borderRadius: "8px",
                        boxShadow: chartPalette.tooltipShadow,
                        padding: "10px 12px",
                        whiteSpace: "nowrap",
                        fontFamily: "var(--font-mono)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <StyledSpendingCategoriesSection_Center>
                  <StyledSpendingCategoriesSection_CenterLabel>
                    Total spent
                  </StyledSpendingCategoriesSection_CenterLabel>

                  <StyledSpendingCategoriesSection_CenterAmount>
                    {formatCurrency(totalSpending, currency)}{" "}
                  </StyledSpendingCategoriesSection_CenterAmount>
                </StyledSpendingCategoriesSection_Center>
              </StyledSpendingCategoriesSection_Chart>
            </StyledSpendingCategoriesSection_ChartArea>

            <StyledSpendingCategoriesSection_List>
              {categories.map((category) => {
                const percentage =
                  totalSpending > 0
                    ? (category.amount / totalSpending) * 100
                    : 0;

                return (
                  <StyledSpendingCategoriesSection_Item key={category.name}>
                    <StyledSpendingCategoriesSection_ItemLeft>
                      <StyledSpendingCategoriesSection_Dot
                        $color={category.color}
                      />

                      <StyledSpendingCategoriesSection_ItemName>
                        {category.name}
                      </StyledSpendingCategoriesSection_ItemName>
                    </StyledSpendingCategoriesSection_ItemLeft>

                    <div>
                      <StyledSpendingCategoriesSection_ItemAmount>
                        {formatCurrency(category.amount, currency)}{" "}
                      </StyledSpendingCategoriesSection_ItemAmount>

                      <StyledSpendingCategoriesSection_ItemPercentage>
                        {percentage.toFixed(1)}%
                      </StyledSpendingCategoriesSection_ItemPercentage>
                    </div>
                  </StyledSpendingCategoriesSection_Item>
                );
              })}
            </StyledSpendingCategoriesSection_List>
          </>
        )}
      </StyledSpendingCategoriesSection_Card>
    </StyledSpendingCategoriesSection>
  );
}

const StyledSpendingCategoriesSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-width: 0;
`;

const StyledSpendingCategoriesSection_Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const StyledSpendingCategoriesSection_Title = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const StyledSpendingCategoriesSection_Description = styled.p`
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
`;

const StyledSpendingCategoriesSection_Card = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: var(--spacing-xl);
  min-width: 0;
  padding: var(--spacing-xl);
  border: none;
  border-radius: var(--radius-xl);
  background: var(--gradient-surface);
  box-shadow:
    var(--specular-top),
    var(--elevation-1);

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
  }
`;

const StyledSpendingCategoriesSection_Empty = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  padding: var(--spacing-xl) 0;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  text-align: center;
`;

const StyledSpendingCategoriesSection_ChartArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
`;

const StyledSpendingCategoriesSection_Chart = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;
  height: 280px;
  min-width: 0;
  overflow: visible;
`;

const StyledSpendingCategoriesSection_Center = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  pointer-events: none;
`;

const StyledSpendingCategoriesSection_CenterLabel = styled.span`
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const StyledSpendingCategoriesSection_CenterAmount = styled.span`
  color: var(--color-primary);
  font-family: var(--font-mono);
  font-size: clamp(20px, 3vw, 24px);
  font-weight: 500;
  letter-spacing: -0.025em;
  font-variant-numeric: tabular-nums;
`;

const StyledSpendingCategoriesSection_List = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const StyledSpendingCategoriesSection_Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
  border-bottom: var(--stroke) solid var(--color-border);

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const StyledSpendingCategoriesSection_ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const StyledSpendingCategoriesSection_Dot = styled.span<{
  $color: string;
}>`
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const StyledSpendingCategoriesSection_ItemName = styled.span`
  overflow: hidden;
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledSpendingCategoriesSection_ItemAmount = styled.p`
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 600;
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const StyledSpendingCategoriesSection_ItemPercentage = styled.p`
  margin: 4px 0 0;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-align: right;
  font-variant-numeric: tabular-nums;
`;
